import { Actor } from "excalibur";
import { Meeple } from "./Meeple";
import { MeepleType, Resources, Products } from "../types";

/**
 * Gets a random visitor from the meeple's visitors set.
 */
export function getRandomVisitor(meeple: Meeple): Meeple | undefined {
  const visitors = Array.from(meeple.visitors);
  return visitors[Math.floor(Math.random() * visitors.length)] ?? undefined;
}

/**
 * Gets a random asteroid with ore from the scene.
 */
export function getRandomAsteroid(meeple: Meeple): Meeple | undefined {
  const meeples = meeple.scene?.actors.filter(
    (a: Actor) => a instanceof Meeple
  );
  const asteroids = meeples?.filter(
    (m: Meeple) =>
      m.type === MeepleType.Asteroid &&
      m !== meeple &&
      (m.goods[Resources.Ore] ?? 0) > 0 // Only return asteroids with ore
  );
  return asteroids?.[Math.floor(Math.random() * asteroids.length)] ?? undefined;
}

/**
 * Gets a random space station from the scene.
 */
export function getRandomStation(meeple: Meeple): Meeple | undefined {
  const meeples = meeple.scene?.actors.filter(
    (a: Actor) => a instanceof Meeple
  );
  const stations = meeples?.filter(
    (m: Meeple) =>
      m.type === MeepleType.SpaceStation && m !== meeple
  );
  return stations?.[Math.floor(Math.random() * stations.length)] ?? undefined;
}

/**
 * Gets a random station that produces the specified product type.
 * Used by traders to find stations to buy products from.
 */
export function getRandomStationThatProduces(
  meeple: Meeple,
  productType: Products
): Meeple | undefined {
  const meeples = meeple.scene?.actors.filter(
    (a: Actor) => a instanceof Meeple
  );
  const stations = meeples?.filter(
    (m: Meeple) =>
      m.type === MeepleType.SpaceStation &&
      m !== meeple &&
      m.productType === productType
  );
  return stations?.[Math.floor(Math.random() * stations.length)] ?? undefined;
}

/**
 * Gets a random station that does NOT produce the specified product type.
 * Used by traders to find stations to sell products to.
 */
export function getRandomStationThatDoesNotProduce(
  meeple: Meeple,
  productType: Products
): Meeple | undefined {
  const meeples = meeple.scene?.actors.filter(
    (a: Actor) => a instanceof Meeple
  );
  const stations = meeples?.filter(
    (m: Meeple) =>
      m.type === MeepleType.SpaceStation &&
      m !== meeple &&
      m.productType !== productType
  );
  return stations?.[Math.floor(Math.random() * stations.length)] ?? undefined;
}

/**
 * Gets a random space bar from the scene.
 */
export function getRandomSpaceBar(meeple: Meeple): Meeple | undefined {
  const meeples = meeple.scene?.actors.filter(
    (a: Actor) => a instanceof Meeple
  );
  const spaceBars = meeples?.filter(
    (m: Meeple) => m.type === MeepleType.SpaceBar && m !== meeple
  );
  return spaceBars?.[Math.floor(Math.random() * spaceBars.length)] ?? undefined;
}

/**
 * Gets a random space apartments from the scene.
 */
export function getRandomSpaceApartments(meeple: Meeple): Meeple | undefined {
  const meeples = meeple.scene?.actors.filter(
    (a: Actor) => a instanceof Meeple
  );
  const spaceApartments = meeples?.filter(
    (m: Meeple) =>
      m.type === MeepleType.SpaceApartments && m !== meeple
  );
  return (
    spaceApartments?.[Math.floor(Math.random() * spaceApartments.length)] ??
    undefined
  );
}

/**
 * Finds a destination by name (exact match) or by type (random from that type).
 * Returns undefined if no destination is found.
 */
export function findDestination(
  meeple: Meeple,
  destinationName?: string,
  destinationType?: MeepleType
): Meeple | undefined {
  const meeples = meeple.scene?.actors.filter(
    (a: Actor) => a instanceof Meeple
  ) as Meeple[];

  // If destinationName is specified, find exact match
  if (destinationName) {
    const found = meeples.find(
      (m: Meeple) => m.name === destinationName && m !== meeple
    );
    if (found) return found;
  }

  // If destinationType is specified, find random from that type
  if (destinationType) {
    const filtered = meeples.filter(
      (m: Meeple) => m.type === destinationType && m !== meeple
    );
    if (filtered.length > 0) {
      return filtered[Math.floor(Math.random() * filtered.length)];
    }
  }

  return undefined;
}

/**
 * Finds a destination asteroid by name or type, with ore availability check.
 */
export function findAsteroid(
  meeple: Meeple,
  destinationName?: string,
  destinationType?: MeepleType
): Meeple | undefined {
  const meeples = meeple.scene?.actors.filter(
    (a: Actor) => a instanceof Meeple
  ) as Meeple[];

  // If destinationName is specified, find exact match
  if (destinationName) {
    const found = meeples.find(
      (m: Meeple) =>
        m.name === destinationName &&
        m !== meeple &&
        m.type === MeepleType.Asteroid &&
        (m.goods[Resources.Ore] ?? 0) > 0
    );
    if (found) return found;
  }

  // If destinationType is specified (should be Asteroid), find random from that type
  if (destinationType === MeepleType.Asteroid) {
    const filtered = meeples.filter(
      (m: Meeple) =>
        m.type === MeepleType.Asteroid &&
        m !== meeple &&
        (m.goods[Resources.Ore] ?? 0) > 0
    );
    if (filtered.length > 0) {
      return filtered[Math.floor(Math.random() * filtered.length)];
    }
  }

  return undefined;
}

/**
 * Finds a destination station by name or type, optionally filtering by product type.
 */
export function findStation(
  meeple: Meeple,
  destinationName?: string,
  destinationType?: MeepleType,
  productType?: Products,
  mustProduce?: boolean
): Meeple | undefined {
  const meeples = meeple.scene?.actors.filter(
    (a: Actor) => a instanceof Meeple
  ) as Meeple[];

  // If destinationName is specified, find exact match
  if (destinationName) {
    const found = meeples.find(
      (m: Meeple) =>
        m.name === destinationName &&
        m !== meeple &&
        m.type === MeepleType.SpaceStation
    );
    if (found) {
      // If productType filter is specified, check it
      if (productType !== undefined) {
        if (mustProduce && found.productType === productType) return found;
        if (!mustProduce && found.productType !== productType) return found;
        return undefined;
      }
      return found;
    }
  }

  // If destinationType is specified (should be SpaceStation), find random from that type
  if (destinationType === MeepleType.SpaceStation) {
    let filtered = meeples.filter(
      (m: Meeple) => m.type === MeepleType.SpaceStation && m !== meeple
    );

    // Apply product type filter if specified
    if (productType !== undefined) {
      if (mustProduce) {
        filtered = filtered.filter((m) => m.productType === productType);
      } else {
        filtered = filtered.filter((m) => m.productType !== productType);
      }
    }

    if (filtered.length > 0) {
      return filtered[Math.floor(Math.random() * filtered.length)];
    }
  }

  return undefined;
}

