import { Actor, Rectangle } from "excalibur";
import type { Meeple } from "./Meeple";
import { MeepleStats, Resources, type GoodType } from "../types";
import { getGoodColor } from "../../utils/goodsUtils";
import {
  FOLLOWER_BASE_DISTANCE,
  FOLLOWER_DISTANCE_INCREMENT,
  FOLLOWER_SIZE,
} from "../game-config";

/**
 * Updates followers based on goods (excluding money and stats).
 */
export function updateFollowers(meeple: Meeple): void {
  // Get all goods except Money and Stats (Health, Energy)
  const goodsWithFollowers = Object.keys(meeple.goods).filter(
    (good): good is GoodType =>
      good !== Resources.Money &&
      !Object.values(MeepleStats).includes(good as MeepleStats)
  );

  // Remove followers for goods that are now 0 or don't exist
  for (const [good, follower] of meeple.followers.entries()) {
    const quantity = meeple.goods[good] ?? 0;
    if (quantity <= 0) {
      follower.kill();
      meeple.followers.delete(good);
    }
  }

  // Create followers for goods > 0 that don't have followers yet
  for (const good of goodsWithFollowers) {
    const quantity = meeple.goods[good] ?? 0;
    if (quantity > 0 && !meeple.followers.has(good)) {
      createFollower(meeple, good);
    }
  }
}

/**
 * Creates a follower actor for a specific good type.
 */
export function createFollower(meeple: Meeple, good: GoodType): void {
  // Calculate distance based on good type to spread followers around
  const goodTypes = Object.keys(meeple.goods).filter(
    (g): g is GoodType =>
      g !== Resources.Money &&
      !Object.values(MeepleStats).includes(g as MeepleStats)
  );
  const goodIndex = goodTypes.indexOf(good);
  const distance =
    FOLLOWER_BASE_DISTANCE + goodIndex * FOLLOWER_DISTANCE_INCREMENT;

  // Create a tiny square follower
  const follower = new Actor({
    pos: meeple.pos.clone(),
    width: FOLLOWER_SIZE,
    height: FOLLOWER_SIZE,
  });

  // Create a small square graphic with color based on good type
  const square = new Rectangle({
    width: FOLLOWER_SIZE,
    height: FOLLOWER_SIZE,
    color: getGoodColor(good),
  });
  follower.graphics.add(square);

  // Add follower to the scene
  meeple.scene?.add(follower);

  // Make the follower follow this meeple at a distance
  follower.actions.follow(meeple, distance);

  meeple.followers.set(good, follower);
}

