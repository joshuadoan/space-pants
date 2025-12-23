import { Actor, Collider, CollisionContact, GraphicsGroup, Rectangle, Scene, Side, Vector } from "excalibur";

import type { Game } from "../Game";
import {
  DEFAULT_ENERGY,
  DEFAULT_HEALTH,
  DEFAULT_TRANSACTION_TIME_MS,
  MEEPLE_SIZE,
  MEEPLE_UPDATE_INTERVAL_MS,
  PIRATE_CHASE_ABANDON_DISTANCE,
  PIRATE_CHASE_DURATION_MS,
  PIRATE_LASER_FIRE_INTERVAL_MS,
  PIRATE_STEAL_AMOUNT,
  PIRATE_STEAL_DISTANCE,
  PIRATE_STEAL_ENERGY_COST_PERCENT,
  SPACE_APARTMENTS_MAX_CAPACITY,
} from "../game-config";
import {
  MeepleStateType,
  MeepleType,
  Products,
  Resources,
  MeepleStats,
  type Goods,
  type GoodType,
  type LogicRule,
  type MeepleState,
  type RuleId,
  type DiaryEntry,
} from "../types";
import { evaluateRule } from "../../utils/ruleUtils";
import { getRandomVisitor } from "./meepleFinders";
import {
  type RegenerationConfig,
} from "../utils/regenerationUtils";

import { executePatrol } from "./executePatrol";
import { executeRuleAction } from "./executeRuleAction";
import { updateFollowers } from "./followers";
import { Laser } from "./Laser";
import { meepleReducer } from "./meepleReducer";
import type { MeepleAction } from "./meepleTypes";

export class Meeple extends Actor {
  speed: number;
  name: string;
  goods: Partial<Goods>;
  rules: LogicRule[];
  state: MeepleState;
  type!: MeepleType; // Assigned by subclasses in their constructors
  visitors: Set<Meeple>;
  activeRuleId: RuleId | null = null;
  productType: Products;
  home: Meeple | null = null; // Assigned home destination
  followers: Map<GoodType, Actor> = new Map(); // Made public for utility functions
  chaseTarget: Meeple | null = null; // Target being chased (for pirates)
  chaseStartTime: number = 0; // When the chase started
  hasStolen: boolean = false; // Whether money has been stolen in current chase
  lastLaserFireTime: number = 0; // When the last laser was fired
  diary: DiaryEntry[] = []; // Stores the last 20 actions/rules for storytelling

  // Special properties for different meeple types
  public prices: Map<GoodType, number> = new Map(); // For SpaceBar
  public maxCapacity: number = SPACE_APARTMENTS_MAX_CAPACITY; // For SpaceApartments
  private regenerationConfig: RegenerationConfig | null = null; // Regeneration configuration

  private lastUpdateTime: number = 0;
  private isRecordingRuleExecution: boolean = false; // Flag to prevent duplicate diary entries
  private isBrokenVisualApplied: boolean = false; // Track if broken visual effect is applied
  private originalColors: Map<Rectangle, import("excalibur").Color> = new Map(); // Store original colors for restoration
  originalSpeed: number | null = null; // Store original speed before breaking (public for executeRuleAction)
  private previousStateType: MeepleStateType | null = null; // Track previous state to detect transitions

  /**
   * Add an entry to the diary, maintaining a maximum of 20 entries
   * Creates a new array to ensure React detects the change
   */
  addDiaryEntry(entry: Omit<DiaryEntry, "timestamp">): void {
    const fullEntry: DiaryEntry = {
      ...entry,
      timestamp: Date.now(),
    };
    // Create a new array instead of mutating to ensure React detects changes
    const newDiary = [...this.diary, fullEntry];
    // Keep only the last 20 entries
    if (newDiary.length > 20) {
      this.diary = newDiary.slice(-20);
    } else {
      this.diary = newDiary;
    }
  }

  /**
   * Dispatch an action to update state and goods
   */
  dispatch(action: MeepleAction): void {
    const previousState = this.state;
    const previousWasBroken = previousState.type === MeepleStateType.Broken;
    
    const newState = meepleReducer(
      {
        goods: this.goods,
        state: this.state,
      },
      action
    );
    this.goods = newState.goods;
    this.state = newState.state;
    
    // Handle speed restoration when transitioning from broken to idle
    const isNowBroken = newState.state.type === MeepleStateType.Broken;
    if (previousWasBroken && !isNowBroken && this.originalSpeed !== null) {
      // Restore original speed when fixed
      this.speed = this.originalSpeed;
      this.originalSpeed = null;
    }
    
    // Update previous state type for visual transitions
    this.previousStateType = previousState.type;
    
    // Record state change in diary if state actually changed
    // Skip if we're in the middle of recording a rule execution (to avoid duplicates)
    if (previousState.type !== newState.state.type && !this.isRecordingRuleExecution) {
      const targetName = "target" in newState.state ? newState.state.target?.name ?? null : null;
      // Create a snapshot of goods at this moment
      const goodsSnapshot = { ...this.goods };
      this.addDiaryEntry({
        ruleId: null,
        action: null,
        state: newState.state.type,
        targetName,
        goods: goodsSnapshot,
      });
    }
  }

  constructor(
    position: Vector,
    speed: number,
    name: string,
    productType: Products,
    width: number = MEEPLE_SIZE.WIDTH,
    height: number = MEEPLE_SIZE.HEIGHT
  ) {
    super({
      pos: position,
      width,
      height,
    });

    this.speed = speed;
    this.name = name;
    this.productType = productType;
    // Initialize goods
    this.goods = {
      [Resources.Ore]: 0,
      [Resources.Money]: 0,
      [MeepleStats.Health]: DEFAULT_HEALTH,
      [MeepleStats.Energy]: DEFAULT_ENERGY,
    };
    // Initialize all products to 0
    Object.values(Products).forEach((product) => {
      this.goods[product] = 0;
    });
    this.rules = [];
    // Initialize state using reducer pattern
    this.state = {
      type: MeepleStateType.Idle,
    };
    // Type should be explicitly set in subclasses - don't rely on constructor.name
    // as it gets minified in production builds
    this.visitors = new Set();
  }

  onInitialize(_engine: Game): void {
    // Initialize lastUpdateTime to current time to ensure first update happens
    // This fixes an issue where meeples don't start moving in production builds
    this.lastUpdateTime = Date.now();

    // Only create followers for miner and trader type meeples
    // Followers will be created dynamically in onPreUpdate based on goods
    if (this.type !== MeepleType.Miner && this.type !== MeepleType.Trader)
      return;
  }

  onCollisionStart(_self: Collider, other: Collider, _side: Side, _contact: CollisionContact): void {
    // Check if the collision is with a Laser (bullet)
    if (other.owner instanceof Laser) {
      const laser = other.owner;
      // Don't damage the meeple that fired the laser
      if (laser.owner === this) {
        return;
      }
      // Don't damage meeples of the same type as the laser owner (friendly fire prevention)
      if (this.type === laser.owner.type) {
        return;
      }
      // Remove 10 health when hit by a bullet
      this.dispatch({
        type: "remove-good",
        payload: { good: MeepleStats.Health, quantity: 10 },
      });
      // Destroy the laser after it hits
      laser.kill();
    }
  }

  onPreKill(_scene: Scene): void {
    // Clean up all followers when the meeple is removed
    for (const follower of this.followers.values()) {
      follower.kill();
    }
    this.followers.clear();
  }

  onPreUpdate(engine: Game): void {
    // Update visual appearance based on broken state transitions
    this.updateBrokenVisuals();
    
    // If broken, stop all movement and prevent any actions
    if (this.state.type === MeepleStateType.Broken) {
      this.stopAllMovement();
      return; // Don't process any further updates when broken
    }

    this.enforceBoundaries();
    this.updateFollowers();

    // Handle special logic for different meeple types
    this.handleSpecialTypeLogic(engine);

    // Handle chasing behavior for pirates
    if (this.type === MeepleType.Pirate && this.chaseTarget) {
      if (this.updatePirateChase()) {
        return; // Don't evaluate rules while chasing
      }
    }

    if (!this.canEvaluateRules()) return;
    if (!this.shouldEvaluateRules()) return;

    this.evaluateRules();
  }

  /**
   * Handles special update logic for different meeple types
   */
  private handleSpecialTypeLogic(_engine: Game): void {
    // SpaceStation: production and conversion logic
    if (this.type === MeepleType.SpaceStation) {
      this.handleSpaceStationLogic();
      return;
    }

    // Asteroid: regeneration logic
    if (this.type === MeepleType.Asteroid) {
      this.handleAsteroidLogic();
      return;
    }

    // SpaceBar: regeneration and visitor state
    if (this.type === MeepleType.SpaceBar) {
      this.handleSocializingDestinationLogic();
      return;
    }
  }

  /**
   * Handles SpaceStation production and conversion logic
   */
  private handleSpaceStationLogic(): void {
    // Keep minimum product: if product is below minimum threshold, regenerate it
    if (this.regenerationConfig) {
      const currentProduct = this.goods[this.productType] || 0;
      if (currentProduct < this.regenerationConfig.minThreshold) {
        this.goods[this.productType] = this.regenerationConfig.minThreshold;
      }
    }
  }

  /**
   * Handles Asteroid regeneration logic
   */
  private handleAsteroidLogic(): void {
    // Keep minimum ore: if ore is below minimum threshold, regenerate it
    if (this.regenerationConfig) {
      const currentAmount = this.goods[this.regenerationConfig.goodType] || 0;
      if (currentAmount < this.regenerationConfig.minThreshold) {
        this.goods[this.regenerationConfig.goodType] = this.regenerationConfig.minThreshold;
      }
    }

    if (this.visitors.size > 1) {
      const randomVisitor = getRandomVisitor(this);
      if (randomVisitor) {
        this.state = {
          type: MeepleStateType.Transacting,
          target: randomVisitor,
        };
      } else {
        this.state = {
          type: MeepleStateType.Idle,
        };
      }
    }
  }

  /**
   * Handles socializing destination logic (SpaceBar)
   */
  private handleSocializingDestinationLogic(): void {
    // Keep minimum fizz: if fizz is below minimum threshold, regenerate it
    if (this.regenerationConfig) {
      const currentAmount = this.goods[this.regenerationConfig.goodType] || 0;
      if (currentAmount < this.regenerationConfig.minThreshold) {
        this.goods[this.regenerationConfig.goodType] = this.regenerationConfig.minThreshold;
      }
    }

    if (this.visitors.size > 1) {
      const randomVisitor = getRandomVisitor(this);
      if (randomVisitor) {
        this.state = {
          type: MeepleStateType.Transacting,
          target: randomVisitor,
        };
      } else {
        this.state = {
          type: MeepleStateType.Idle,
        };
      }
    }
  }

  /**
   * Transaction method for SpaceBar
   */
  transaction(good: GoodType, quantity: number, transactionType: "add" | "remove"): void {
    switch (transactionType) {
      case "add":
        // Buy goods (adds to inventory) - not typically used
        this.goods[good] = (this.goods[good] ?? 0) + quantity;
        break;
      case "remove":
        // Sell goods (subtracts from inventory)
        const currentGood = this.goods[good] ?? 0;
        if (currentGood >= quantity) {
          this.goods[good] = currentGood - quantity;
        }
        break;
    }
  }

  /**
   * Check if the apartments have room for more visitors (for SpaceApartments)
   */
  hasCapacity(): boolean {
    return this.visitors.size < this.maxCapacity;
  }

  /**
   * Initialize regeneration config for types that need it
   */
  initializeRegeneration(config: RegenerationConfig): void {
    this.regenerationConfig = config;
  }

  /**
   * Stops all movement and clears chase state
   */
  private stopAllMovement(): void {
    this.actions.clearActions();
    this.speed = 0;
    this.stopMovement();
    if (this.chaseTarget) {
      this.chaseTarget = null;
      this.hasStolen = false;
    }
  }

  /**
   * Updates visual appearance based on broken state transitions
   */
  private updateBrokenVisuals(): void {
    const isBroken = this.state.type === MeepleStateType.Broken;
    const previousWasBroken = this.previousStateType === MeepleStateType.Broken;
    
    // Apply broken visual when transitioning to broken state
    if (isBroken && !this.isBrokenVisualApplied) {
      this.graphics.opacity = 0.75;
      this.applyBrokenVisual();
      this.isBrokenVisualApplied = true;
    } 
    // Restore normal visual when transitioning from broken state
    else if (!isBroken && previousWasBroken && this.isBrokenVisualApplied) {
      this.graphics.opacity = 1.0;
      this.restoreNormalVisual();
      this.isBrokenVisualApplied = false;
    }
  }

  /**
   * Enforces world boundaries for velocity-based movement
   */
  private enforceBoundaries(): void {
    const scene = this.scene as Scene;
    if (!scene?.engine) return;

    const game = scene.engine as Game;

    // Clamp position to world bounds and stop velocity at boundaries
    if (this.pos.x < 0) {
      this.pos.x = 0;
      if (this.vel.x < 0) this.vel.x = 0;
    }
    if (this.pos.x > game.worldWidth - this.width) {
      this.pos.x = game.worldWidth - this.width;
      if (this.vel.x > 0) this.vel.x = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = 0;
      if (this.vel.y < 0) this.vel.y = 0;
    }
    if (this.pos.y > game.worldHeight - this.height) {
      this.pos.y = game.worldHeight - this.height;
      if (this.vel.y > 0) this.vel.y = 0;
    }
  }

  /**
   * Updates followers for miner and trader meeples
   */
  private updateFollowers(): void {
    if (this.type === MeepleType.Miner || this.type === MeepleType.Trader) {
      updateFollowers(this);
    }
  }

  /**
   * Updates pirate chase behavior. Returns true if chase is active, false otherwise.
   */
  private updatePirateChase(): boolean {
    if (!this.chaseTarget) return false;

    const elapsed = Date.now() - this.chaseStartTime;

    // Check if chase duration has elapsed
    if (elapsed >= PIRATE_CHASE_DURATION_MS) {
      this.abandonChase();
      return false;
    }

    // Check if target is still valid
    if (!this.chaseTarget.scene || this.chaseTarget.scene !== this.scene) {
      this.abandonChase();
      return false;
    }

    // Check if pirate is close to any destination
    if (this.isNearDestination()) {
      this.abandonChase();
      return false;
    }

    // Execute chase behavior
    this.executeChase();
    return true;
  }

  /**
   * Abandons the current chase and optionally starts patrolling
   */
  private abandonChase(): void {
    this.stopMovement();
    this.chaseTarget = null;
    this.hasStolen = false;
    this.dispatch({ type: "set-idle" });
    
    // Only patrol if we have energy, otherwise let rule evaluation send us to recharge
    const currentEnergy = this.goods[MeepleStats.Energy] ?? DEFAULT_ENERGY;
    if (currentEnergy > 0) {
      executePatrol(this);
    }
  }

  /**
   * Checks if pirate is close to any destination that would cause chase abandonment
   */
  private isNearDestination(): boolean {
    const scene = this.scene;
    if (!scene) return false;

    const allActors = scene.actors.filter(
      (actor) => actor instanceof Meeple
    ) as Meeple[];
    
    const destinationTypes = [
      MeepleType.Asteroid,
      MeepleType.SpaceStation,
      MeepleType.SpaceBar,
      MeepleType.SpaceApartments,
      MeepleType.PirateDen,
    ];

    return allActors.some((m) => {
      if (m === this) return false;
      if (!destinationTypes.includes(m.type)) return false;
      const distanceToDestination = this.pos.distance(m.pos);
      return distanceToDestination <= PIRATE_CHASE_ABANDON_DISTANCE;
    });
  }

  /**
   * Executes the chase behavior: stealing, movement, and laser firing
   */
  private executeChase(): void {
    if (!this.chaseTarget) return;

    const distance = this.pos.distance(this.chaseTarget.pos);
    const MIN_CHASE_DISTANCE = 150;

    // Steal money if close enough
    if (distance <= PIRATE_STEAL_DISTANCE && !this.hasStolen) {
      this.attemptSteal();
    }

    // Move towards target
    const direction = this.chaseTarget.pos.sub(this.pos);
    const dist = direction.size;

    if (dist > 0) {
      const normalized = direction.normalize();

      // Refined chasing logic: maintain distance and match speed when close
      if (distance > MIN_CHASE_DISTANCE) {
        this.vel.x = normalized.x * this.speed;
        this.vel.y = normalized.y * this.speed;
      } else {
        const distanceFactor = Math.max(0.1, distance / MIN_CHASE_DISTANCE);
        const adjustedSpeed = this.speed * distanceFactor;
        this.vel.x = normalized.x * adjustedSpeed;
        this.vel.y = normalized.y * adjustedSpeed;
      }

      // Fire lasers periodically
      this.fireLaserIfReady(direction);
    } else {
      this.stopMovement();
    }
  }

  /**
   * Attempts to steal money from the chase target
   */
  private attemptSteal(): void {
    if (!this.chaseTarget || this.hasStolen) return;

    const targetMoney = this.chaseTarget.goods[Resources.Money] ?? 0;
    if (targetMoney > 0) {
      // Pirate gains money
      this.dispatch({
        type: "add-good",
        payload: { good: Resources.Money, quantity: PIRATE_STEAL_AMOUNT },
      });
      // Target loses money
      this.chaseTarget.dispatch({
        type: "remove-good",
        payload: { good: Resources.Money, quantity: PIRATE_STEAL_AMOUNT },
      });
      // Pirate loses percentage of current energy when stealing
      const currentEnergy = this.goods[MeepleStats.Energy] ?? DEFAULT_ENERGY;
      const energyCost = Math.max(1, Math.floor(currentEnergy * PIRATE_STEAL_ENERGY_COST_PERCENT));
      this.dispatch({
        type: "remove-good",
        payload: { good: MeepleStats.Energy, quantity: energyCost },
      });
      this.hasStolen = true;
    }
  }

  /**
   * Fires a laser if enough time has passed since the last one
   */
  private fireLaserIfReady(direction: Vector): void {
    const timeSinceLastLaser = Date.now() - this.lastLaserFireTime;
    if (timeSinceLastLaser >= PIRATE_LASER_FIRE_INTERVAL_MS) {
      const laser = new Laser(
        this.pos.clone(),
        direction,
        this,
        200 // Laser speed
      );
      this.scene?.add(laser);
      this.lastLaserFireTime = Date.now();
    }
  }

  /**
   * Checks if rules can be evaluated (action queue is complete)
   */
  private canEvaluateRules(): boolean {
    try {
      return this.actions.getQueue().isComplete();
    } catch (error) {
      console.warn("Action queue check failed for", this.name, error);
      return true; // Allow rule evaluation on error
    }
  }

  /**
   * Checks if enough time has passed to evaluate rules
   */
  private shouldEvaluateRules(): boolean {
    const currentTime = Date.now();
    if (this.lastUpdateTime === 0) {
      this.lastUpdateTime = currentTime;
    }
    if (currentTime - this.lastUpdateTime < MEEPLE_UPDATE_INTERVAL_MS) {
      return false;
    }
    this.lastUpdateTime = currentTime;
    return true;
  }

  /**
   * Evaluates rules and executes the first matching rule
   */
  private evaluateRules(): void {
    let ruleMatched = false;
    
    for (const rule of this.rules) {
      // For product-type goods, use rule's productType or fall back to meeple's productType
      const isProductGood = Object.values(Products).includes(
        rule.good as Products
      );
      const goodToCheck =
        isProductGood && rule.productType
          ? rule.productType
          : isProductGood && !rule.productType
          ? this.productType
          : rule.good;

      if (evaluateRule(rule, this.goods[goodToCheck] ?? 0)) {
        this.activeRuleId = rule.id;
        this.isRecordingRuleExecution = true;
        const actionExecuted = executeRuleAction(this, rule);
        this.isRecordingRuleExecution = false;
        
        if (actionExecuted) {
          const targetName = "target" in this.state ? this.state.target?.name ?? null : null;
          const goodsSnapshot = { ...this.goods };
          this.addDiaryEntry({
            ruleId: rule.id,
            action: rule.action,
            state: this.state.type,
            targetName,
            goods: goodsSnapshot,
          });
          ruleMatched = true;
          break; // Only execute one rule per update cycle
        }
      }
    }
    
    // Clear active rule if no rule matched and meeple is idle
    if (!ruleMatched && this.state.type === MeepleStateType.Idle) {
      this.activeRuleId = null;
    }
  }

  moveDIrection(direction: "left" | "right" | "up" | "down"): void {
    // Use velocity for smooth, frame-rate independent movement
    // Boundary checking is handled in onPreUpdate
    switch (direction) {
      case "left":
        this.vel.x = -this.speed;
        break;
      case "right":
        this.vel.x = this.speed;
        break;
      case "up":
        this.vel.y = -this.speed;
        break;
      case "down":
        this.vel.y = this.speed;
        break;
    }
  }

  stopMovement(): void {
    this.vel.x = 0;
    this.vel.y = 0;
  }

  transact(
    type: "add" | "remove",
    good: GoodType,
    quantity: number,
    transactionTime: number = DEFAULT_TRANSACTION_TIME_MS
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        switch (type) {
          case "add":
            this.dispatch({
              type: "add-good",
              payload: { good, quantity },
            });
            resolve();
            break;
          case "remove":
            this.dispatch({
              type: "remove-good",
              payload: { good, quantity },
            });
            resolve();
            break;
          default:
            reject(new Error("Invalid transaction type"));
        }
      }, transactionTime);
    });
  }

  /**
   * Apply broken visual effect: darken colors and reduce opacity
   */
  private applyBrokenVisual(): void {
    // Darken all colors in the graphics group
    if (this.graphics.current instanceof GraphicsGroup) {
      const graphicsGroup = this.graphics.current;
      for (const member of graphicsGroup.members) {
        const graphic = 'graphic' in member ? member.graphic : null;
        if (graphic instanceof Rectangle) {
          // Store original color if not already stored
          if (!this.originalColors.has(graphic)) {
            this.originalColors.set(graphic, graphic.color.clone());
          }
          
          // Darken the color by reducing RGB values
          const originalColor = graphic.color;
          const darkenedColor = originalColor.clone();
          darkenedColor.r = Math.max(0, originalColor.r * 0.3);
          darkenedColor.g = Math.max(0, originalColor.g * 0.3);
          darkenedColor.b = Math.max(0, originalColor.b * 0.3);
          graphic.color = darkenedColor;
        }
      }
    }
  }

  /**
   * Restore normal visual appearance
   */
  private restoreNormalVisual(): void {
    // Restore original colors
    if (this.graphics.current instanceof GraphicsGroup) {
      const graphicsGroup = this.graphics.current;
      for (const member of graphicsGroup.members) {
        const graphic = 'graphic' in member ? member.graphic : null;
        if (graphic instanceof Rectangle) {
          const originalColor = this.originalColors.get(graphic);
          if (originalColor) {
            graphic.color = originalColor.clone();
          }
        }
      }
    }
    // Clear stored colors
    this.originalColors.clear();
  }
}
