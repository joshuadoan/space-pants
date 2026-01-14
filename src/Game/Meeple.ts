import { Actor, Timer, Vector, Color, Line, CollisionType } from "excalibur";
import {
  MeepleRoles,
  type MeepleInventory,
  type MeepleState,
  type MeepleAction,
  type MeepleTransaction,
  type Condition,
  ConditionType,
  Operator,
  MeepleStateNames,
  MeepleInventoryItem,
  type ActionHistory,
} from "../types";
import type { Game } from "./Game";

export class Meeple extends Actor {
  speed: number = 100;
  roleId: MeepleRoles;
  lastUpdate: number = 0;
  conditions: Condition[] = [];
  state: MeepleState = { type: MeepleStateNames.Idle };
  home: Meeple | null = null;
  inventory: MeepleInventory;
  actionsHistory: ActionHistory[] = [];
  constructor({
    width,
    height,
    roleId,
    inventory,
    conditions,
  }: {
    width: number;
    height: number;
    roleId: MeepleRoles;
    inventory: MeepleInventory;
    conditions: Condition[];
  }) {
    super({
      width,
      height,
    });

    this.roleId = roleId;
    this.inventory = inventory;
    this.conditions = conditions;
  }

  onInitialize(game: Game): void {
    const timer = this.traderTimer(game);

    game.currentScene.add(timer);
    timer.start();
  }
  traderTimer(game: Game): Timer {
    const timer = new Timer({
      fcn: () => {
        switch (this.state.type) {
          case MeepleStateNames.Chasing:
            this.fireLaser(this.state.target);
            // if chase sis over 5 seconds, stop chasing
            if (Date.now() - this.state.startTime > 5000) {
              this.dispatch({
                type: "finish",
                state: { type: MeepleStateNames.Idle },
              });
            }
            break;
          case MeepleStateNames.Patrolling:
            const meeplesInRadar = this.useRadar({
              meepleRoles: [this.state.role],
              radius: 300,
            });
            if (meeplesInRadar.length > 0) {
              this.dispatch({
                type: "chase",
                target: meeplesInRadar[0],
                startTime: Date.now(),
              });
            }
            break;
          case MeepleStateNames.Generating:
            break;
          case MeepleStateNames.Mining:
            break;
          case MeepleStateNames.Transacting:
            break;
          case MeepleStateNames.Buying:
            break;
          case MeepleStateNames.Selling:
            break;
          case MeepleStateNames.Transmuting:
            break;
          case MeepleStateNames.Consuming:
            break;
          default:
            break;
        }

        if (this.actions.getQueue().hasNext()) {
          return;
        }

        for (const condition of this.conditions) {
          if (this.evaluateCondition(condition)) {
            condition.action(this, game);
            break;
          }
        }
      },
      repeats: true,
      // randomize the interval between 100 and 1000
      interval: 1000,
    });

    return timer;
  }

  dispatch(action: MeepleAction) {
    switch (action.type) {
      case "travel":
        this.state = {
          type: MeepleStateNames.Traveling,
          target: action.target,
        };
        break;
      case "visit":
        this.state = { type: MeepleStateNames.Visiting, target: action.target };
        break;
      case "transact":
        this.state = {
          type: MeepleStateNames.Transacting,
          transaction: action.transaction,
        };
        this.transact(this.state.transaction);
        break;
      case "mine":
        this.state = {
          type: MeepleStateNames.Mining,
          target: action.target,
          property: action.property,
          quantity: action.quantity,
        };
        this.mine(this.state.target, this.state.property, this.state.quantity);
        break;
      case "buy":
        this.state = {
          type: MeepleStateNames.Buying,
          target: action.target,
          property: action.property,
          quantity: action.quantity,
          price: action.price,
        };
        this.buy(
          this.state.target,
          this.state.property,
          this.state.quantity,
          this.state.price
        );
        break;
      case "sell":
        this.state = {
          type: MeepleStateNames.Selling,
          target: action.target,
          property: action.property,
          quantity: action.quantity,
          price: action.price,
        };
        this.sell(
          this.state.target,
          this.state.property,
          this.state.quantity,
          this.state.price
        );
        break;
      case "transmutation":
        this.state = {
          type: MeepleStateNames.Transmuting,
          fromProperty: action.fromProperty,
          toProperty: action.toProperty,
          fromQuantity: action.fromQuantity,
          toQuantity: action.toQuantity,
        };
        this.transmutation(
          this.state.fromProperty,
          this.state.fromQuantity,
          this.state.toProperty,
          this.state.toQuantity
        );
        break;
      case "generate":
        this.state = {
          type: MeepleStateNames.Generating,
          property: action.property,
          quantity: action.quantity,
        };
        this.generate(this.state.property, this.state.quantity);
        break;
      case "consume":
        this.state = {
          type: MeepleStateNames.Consuming,
          property: action.property,
          quantity: action.quantity,
        };
        this.consume(this.state.property, this.state.quantity);

        break;
      case "patrol-for-role":
        this.state = {
          type: MeepleStateNames.Patrolling,
          role: action.role,
        };

        const game = this.scene?.engine as Game;
        if (!game) {
          return;
        }
        // random point  wihtin 1/4 of the game size
        const randomPoints = [
          game.getRandomPointInGame(),
          game.getRandomPointInGame(),
          game.getRandomPointInGame(),
        ];

        for (const point of randomPoints) {
          this.actions.moveTo(point, this.speed);
        }
        break;
      case "chase":
        this.state = {
          type: MeepleStateNames.Chasing,
          target: action.target,
          startTime: action.startTime,
        };
        this.actions.clearActions();
        this.actions.follow(action.target, this.speed);
        break;
      case "flee":
        break;
      case "finish":
        this.actions.clearActions();
        this.state = action.state || { type: MeepleStateNames.Idle };
        break;
      default:
        break;
    }

    this.addActionHistory({
      action,
      timestamp: Date.now(),
      state: this.state,
    });
  }

  evaluateCondition(condition: Condition) {
    switch (condition.type) {
      case ConditionType.Inventory:
        const inventory =
          condition.target && condition.target.inventory
            ? condition.target.inventory[condition.property]
            : this.inventory[condition.property];

        const quantity = condition.quantity;
        const operator = condition.operator;

        switch (operator) {
          case Operator.LessThan:
            return inventory < quantity;
          case Operator.GreaterThan:
            return inventory > quantity;
          case Operator.GreaterThanOrEqual:
            return inventory >= quantity;
          case Operator.LessThanOrEqual:
            return inventory <= quantity;
          case Operator.Equal:
            return inventory === quantity;
          case Operator.NotEqual:
            return inventory !== quantity;
          default:
            return false;
        }
      case ConditionType.Radar:
        const nearbyMeeples = this.useRadar({
          meepleRoles: [condition.role],
          radius: condition.quantity,
        });

        if (nearbyMeeples.length > 0) {
          condition.target = nearbyMeeples[0];
          return true;
        }
        return false;
      default:
        return false;
    }
  }

  setInventory(inventory: MeepleInventory) {
    this.inventory = { ...inventory };
  }

  delay(delay: number) {
    return this.actions.delay(delay);
  }

  // addActionHistory // store last 100 actions
  addActionHistory({
    action,
    timestamp,
    state,
  }: {
    action: MeepleAction;
    timestamp: number;
    state: MeepleState;
  }) {
    this.actionsHistory.push({
      action,
      timestamp,
      state,
    });

    if (this.actionsHistory.length > 100) {
      this.actionsHistory.shift();
    }
  }

  transact(transaction: MeepleTransaction) {
    if (transaction.from) {
      transaction.from.setInventory({
        ...transaction.from.inventory,
        [transaction.property]:
          transaction.from.inventory[transaction.property] -
          transaction.quantity,
      });
    }

    if (transaction.to) {
      transaction.to.setInventory({
        ...transaction.to.inventory,
        [transaction.property]:
          transaction.to.inventory[transaction.property] + transaction.quantity,
      });
    }
  }

  buy(
    seller: Meeple,
    property: MeepleInventoryItem,
    quantity: number,
    price: number
  ) {
    // update buyer's inventory
    this.setInventory({
      ...this.inventory,
      [property]: this.inventory[property] + quantity,
      [MeepleInventoryItem.Money]:
        this.inventory[MeepleInventoryItem.Money] - price * quantity,
    });

    // update seller's inventory
    seller.setInventory({
      ...seller.inventory,
      [property]: seller.inventory[property] - quantity,
      [MeepleInventoryItem.Money]:
        seller.inventory[MeepleInventoryItem.Money] + price * quantity,
    });
  }

  sell(
    buyer: Meeple,
    property: MeepleInventoryItem,
    quantity: number,
    price: number
  ) {
    // Seller loses property and gains money
    this.setInventory({
      ...this.inventory,
      [property]: this.inventory[property] - quantity,
      [MeepleInventoryItem.Money]:
        this.inventory[MeepleInventoryItem.Money] + price * quantity,
      // this.inventory[MeepleInventoryItem.Money] + price * quantity,
    });

    // Buyer gains property and loses money
    buyer.setInventory({
      ...buyer.inventory,
      [property]: buyer.inventory[property] + quantity,
      [MeepleInventoryItem.Money]:
        buyer.inventory[MeepleInventoryItem.Money] - price * quantity,
    });
  }

  consume(property: MeepleInventoryItem, quantity: number) {
    this.setInventory({
      ...this.inventory,
      [property]: this.inventory[property] - quantity,
    });
  }

  mine(target: Meeple, property: MeepleInventoryItem, quantity: number) {
    // Target loses quantity, miner gains quantity
    target.setInventory({
      ...target.inventory,
      [property]: target.inventory[property] - quantity,
    });
    this.setInventory({
      ...this.inventory,
      [property]: this.inventory[property] + quantity,
    });
  }
  transmutation(
    fromProperty: MeepleInventoryItem,
    fromQuantity: number,
    toProperty: MeepleInventoryItem,
    toQuantity: number
  ) {
    // Lose source material, gain converted material
    this.setInventory({
      ...this.inventory,
      [fromProperty]: this.inventory[fromProperty] - fromQuantity,
      [toProperty]: this.inventory[toProperty] + toQuantity,
    });
  }

  generate(property: MeepleInventoryItem, quantity: number) {
    this.setInventory({
      ...this.inventory,
      [property]: this.inventory[property] + quantity,
    });
  }

  fireLaser(target: Meeple) {
    if (!this.scene) {
      return;
    }

    const game = this.scene.engine as Game;
    if (!game) {
      return;
    }

    // Machine gun style: fire multiple projectiles in rapid succession
    const numProjectiles = 5;
    const fireInterval = 200; // milliseconds between shots

    for (let i = 0; i < numProjectiles; i++) {
      setTimeout(() => {
        const projectile = new LaserProjectile(this, target);
        this.scene?.add(projectile);
      }, i * fireInterval);
    }
  }

  // returns a list of meeples within a radias with dedault radius of 100
  useRadar({
    meepleRoles,
    radius = 300,
  }: {
    meepleRoles: MeepleRoles[];
    radius: number;
  }): Meeple[] {
    if (!this.scene) {
      return [];
    }

    const thisPos = this.pos;
    const nearbyMeeples: Meeple[] = [];

    // Get all actors from the scene
    const allActors = this.scene.actors;

    // Filter for Meeple instances with matching roles
    for (const actor of allActors) {
      if (actor instanceof Meeple && actor !== this) {
        // Check if the meeple's role is in the provided roles list
        if (meepleRoles.includes(actor.roleId)) {
          // Calculate distance from this meeple to the other meeple
          const distance = thisPos.distance(actor.pos);
          // If within radius, add to results
          if (distance <= radius) {
            nearbyMeeples.push(actor);
          }
        }
      }
    }

    return nearbyMeeples;
  }
}

/**
 * Laser projectile that fires from a meeple toward a target.
 * Appears as a small dash/line and destroys itself after a moment or on collision.
 */
class LaserProjectile extends Actor {
  private target: Meeple;
  private speed: number = 500;
  private lifetime: number = 1000; // milliseconds
  private startTime: number;

  constructor(shooter: Meeple, target: Meeple) {
    super({
      width: 4,
      height: 4,
      collisionType: CollisionType.Passive,
    });

    this.target = target;
    this.startTime = Date.now();

    // Position at the shooter's position
    this.pos = shooter.pos.clone();

    // Calculate direction toward target
    const direction = target.pos.sub(shooter.pos).normalize();
    this.vel = direction.scale(this.speed);

    // Create a small line graphic (dash)
    const line = new Line({
      start: Vector.Zero,
      end: new Vector(8, 0), // 8 pixel dash
      color: Color.fromHex("#FF4444"), // Bright red
      thickness: 2,
    });

    // Rotate the line to point toward target
    this.rotation = direction.toAngle();

    this.graphics.add(line);

    // Set up collision detection
    this.on("precollision", (evt) => {
      const otherActor = evt.other.owner;
      if (otherActor instanceof Meeple && otherActor === target) {
        this.kill();
      }
    });
  }

  onPreUpdate(_engine: any, _delta: number): void {
    // Destroy after lifetime expires
    if (Date.now() - this.startTime > this.lifetime) {
      this.kill();
      return;
    }

    // If target is dead or removed, destroy projectile
    if (this.target.isKilled()) {
      this.kill();
      return;
    }

    // Check distance to target as a fallback collision detection
    const distanceToTarget = this.pos.distance(this.target.pos);
    if (distanceToTarget < 10) {
      // Close enough to consider it a hit
      this.kill();
      return;
    }

    // Update direction to track moving target
    const direction = this.target.pos.sub(this.pos).normalize();
    this.vel = direction.scale(this.speed);
    this.rotation = direction.toAngle();
  }
}
