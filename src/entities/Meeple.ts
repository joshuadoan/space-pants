import { Actor, Vector } from "excalibur";
import { createSpaceShipOutOfShapes } from "./utils/createSpaceShipOutOfShapes";
import { Resources, type Goods } from "../types";
import type { GoodType } from "../types";
import type { Game } from "./Game";
import {
  ComparisonOperator,
  LogicRuleActionType,
  MeepleStateType,
  MeepleType,
  type LogicRule,
  type MeepleState,
} from "./types";

export class Meeple extends Actor {
  speed: number;
  name: string;
  goods: Partial<Goods>;
  rules: LogicRule[];
  state: MeepleState;
  type: MeepleType;
  visitors: Set<Meeple>;

  private lastUpdateTime: number = 0;

  constructor(
    position: Vector,
    speed: number,
    name: string,
    width: number = 20,
    height: number = 20
  ) {
    super({
      pos: position,
      width,
      height,
    });

    this.speed = speed;
    this.name = name;
    this.goods = {
      [Resources.Ore]: 0,
      [Resources.Money]: 0,
    };
    this.rules = [];
    const meepleDesign = createSpaceShipOutOfShapes();
    this.graphics.add(meepleDesign);
    this.state = {
      type: MeepleStateType.Idle,
    };
    this.type = this.constructor.name as MeepleType;
    this.visitors = new Set();
  }
  onInitialize(_engine: Game): void {
    // if (this.state.type !== MeepleStateType.Idle) return;
  }

  onPreUpdate(_engine: Game): void {
    if (!this.actions.getQueue().isComplete()) return;

    const currentTime = Date.now();
    if (currentTime - this.lastUpdateTime < 1000) return;
    this.lastUpdateTime = currentTime;

    // this.updateState();
    for (const rule of this.rules) {
      if (this.evaluateRule(rule, this.goods[rule.good] ?? 0)) {
        // add to actions
        switch (rule.action) {
          case LogicRuleActionType.MineOre: {
            const asteroid = this.getRandomAsteroid();
            if (!asteroid) {
              break;
            }

            this.actions
              // set the state to traveling to the target
              .callMethod(
                () =>
                  (this.state = {
                    type: MeepleStateType.Traveling,
                    target: asteroid,
                  })
              )
              // travel to the target
              .meet(asteroid, this.speed)
              // add the meeple to the visitors
              .callMethod(() => asteroid.visitors.add(this))
              // add the ore to the meeple
              .callMethod(() => this.transact("add", Resources.Ore, 10))
              // remove the ore from the target
              .callMethod(() => asteroid.transact("remove", Resources.Ore, 10))
              // set the state to mining
              .callMethod(
                () =>
                  (this.state = {
                    type: MeepleStateType.Mining,
                    target: asteroid,
                  })
              )
              // mine the target
              .delay(1000)
              // remove the meeple from the visitors
              .callMethod(() => asteroid.visitors.delete(this))
              // set the state to idle
              .callMethod(
                () =>
                  (this.state = {
                    type: MeepleStateType.Idle,
                  })
              );
            break;
          }
          case LogicRuleActionType.TradeOreForMoney: {
            const station = this.getRandomStation();
            if (!station) {
              break;
            }

            this.actions
              // set the state to traveling to the target
              .callMethod(
                () =>
                  (this.state = {
                    type: MeepleStateType.Traveling,
                    target: station,
                  })
              )
              // travel to the target
              .meet(station, this.speed)
              // add the meeple to the visitors
              .callMethod(() => station.visitors.add(this))
              // add the ore to the meeple
              .callMethod(() => this.transact("remove", Resources.Ore, 10))
              .callMethod(() => this.transact("add", Resources.Money, 10))
              // remove the ore from the target
              .callMethod(() => station.transact("add", Resources.Ore, 10))
              .callMethod(() => station.transact("remove", Resources.Money, 10))
              // remove the meeple from the visitors
              .callMethod(() => station.visitors.delete(this))
              // set the state to mining
              .callMethod(
                () =>
                  (this.state = {
                    type: MeepleStateType.Trading,
                    target: station,
                  })
              )
              // mine the target
              .delay(5000)
              // set the state to idle
              .callMethod(
                () =>
                  (this.state = {
                    type: MeepleStateType.Idle,
                  })
              );
            break;
          }
          case LogicRuleActionType.Socialize: {
            const spaceBar = this.getRandomSpaceBar();
            if (!spaceBar) {
              break;
            }

            this.actions
              // set the state to traveling to the target
              .callMethod(
                () =>
                  (this.state = {
                    type: MeepleStateType.Traveling,
                    target: spaceBar,
                  })
              )
              // travel to the target
              .meet(spaceBar, this.speed)
              // set the state to trading
              .callMethod(
                () =>
                  (this.state = {
                    type: MeepleStateType.Socializing,
                    target: spaceBar,
                  })
              )
              // add the meeple to the visitors
              .callMethod(() => spaceBar.visitors.add(this))
              .callMethod(() =>
                this.transact(
                  "remove",
                  Resources.Money,
                  this.goods[Resources.Money] ?? 0
                )
              )
              .callMethod(() =>
                spaceBar.transact(
                  "add",
                  Resources.Money,
                  this.goods[Resources.Money] ?? 0
                )
              )
              .delay(100 * (this.goods[Resources.Money] ?? 0))
              // remove the meeple from the visitors
              .callMethod(() => spaceBar.visitors.delete(this))
              // set the state to idle
              .callMethod(
                () =>
                  (this.state = {
                    type: MeepleStateType.Idle,
                  })
              );
            break;
          }
          case LogicRuleActionType.GoShopping: {
            const station = this.getRandomStation();
            if (!station) {
              break;
            }

            this.actions
              .callMethod(
                () =>
                  (this.state = {
                    type: MeepleStateType.Traveling,
                    target: station,
                  })
              )
              // travel to the target
              .meet(station, this.speed)
              // add the meeple to the visitors
              .callMethod(() => station.visitors.add(this))
              // if a random good (not ore or money) is greater than equal to 10 then buy the goods
              .callMethod(() => {
                const good = this.getGoodWithMostAmmount(station);

                if (!good) {
                  return;
                }
                if (station.goods[good] && station.goods[good] >= 1) {
                  this.transact("add", good, 1);
                  station.transact("remove", good, 1);
                  this.transact("remove", Resources.Money, 1);
                  station.transact("add", Resources.Money, 1);
                }
              })
              .delay(1000)
              // remove the meeple from the visitors
              .callMethod(() => station.visitors.delete(this))
              // set the state to idle
              .callMethod(
                () =>
                  (this.state = {
                    type: MeepleStateType.Idle,
                  })
              );
            break;
          }
          case LogicRuleActionType.GoSelling: {
            const station = this.getRandomStation();
            if (!station) {
              break;
            }

            this.actions
              .callMethod(
                () =>
                  (this.state = {
                    type: MeepleStateType.Traveling,
                    target: station,
                  })
              )
              // travel to the target
              .meet(station, this.speed)
              // add the meeple to the visitors
              .callMethod(() => station.visitors.add(this))
              // sell all goods that aren't ore or money for money (1 money per good)
              .callMethod(() => {
                const goods = Object.keys(this.goods).filter(
                  (good): good is GoodType =>
                    good !== Resources.Ore && good !== Resources.Money
                );
                for (const good of goods) {
                  const quantity = this.goods[good] ?? 0;
                  if (quantity > 0) {
                    // remove goods from meeple
                    this.transact("remove", good, quantity);
                    // add goods to station
                    station.transact("add", good, quantity);
                    // add money to meeple (1 per good sold)
                    this.transact("add", Resources.Money, quantity);
                    // remove money from station (1 per good bought)
                    station.transact("remove", Resources.Money, quantity);
                  }
                }
              })
              .delay(1000)
              // remove the meeple from the visitors
              .callMethod(() => station.visitors.delete(this))
              // set the state to idle
              .callMethod(
                () =>
                  (this.state = {
                    type: MeepleStateType.Idle,
                  })
              );
            break;
          }
        }
      }
    }
  }

  /// get good with most ammount that is not money or ore
  getGoodWithMostAmmount(station: Meeple): GoodType | undefined {
    const goods = Object.keys(station.goods).filter(
      (good): good is GoodType =>
        good !== Resources.Ore && good !== Resources.Money
    );
    if (!goods.length) {
      return undefined;
    }
    return goods.reduce(
      (max, good) =>
        (station.goods[good] ?? 0) > (station.goods[max] ?? 0) ? good : max,
      goods[0]
    );
  }

  getRandomAsteroid(): Meeple | undefined {
    const meeples = this.scene?.actors.filter(
      (a: Actor) => a instanceof Meeple
    );
    const asteroids = meeples?.filter(
      (meeple: Meeple) => meeple.type === MeepleType.Asteroid
    );
    return (
      asteroids?.[Math.floor(Math.random() * asteroids.length)] ?? undefined
    );
  }

  getRandomStation(): Meeple | undefined {
    const meeples = this.scene?.actors.filter(
      (a: Actor) => a instanceof Meeple
    );
    const stations = meeples?.filter(
      (meeple: Meeple) => meeple.type === MeepleType.SpaceStation
    );
    return stations?.[Math.floor(Math.random() * stations.length)] ?? undefined;
  }

  getRandomSpaceBar(): Meeple | undefined {
    const meeples = this.scene?.actors.filter(
      (a: Actor) => a instanceof Meeple
    );
    const spaceBars = meeples?.filter(
      (meeple: Meeple) => meeple.type === MeepleType.SpaceBar
    );
    return (
      spaceBars?.[Math.floor(Math.random() * spaceBars.length)] ?? undefined
    );
  }

  transact(
    type: "add" | "remove",
    good: GoodType,
    quantity: number,
    transactionTime: number = 1000
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        switch (type) {
          case "add":
            this.goods[good] = (this.goods[good] || 0) + quantity;
            resolve();
            break;
          case "remove":
            this.goods[good] = (this.goods[good] || 0) - quantity;
            resolve();
            break;
          default:
            reject(new Error("Invalid transaction type"));
        }
      }, transactionTime);
    });
  }

  evaluateRule(rule: LogicRule, value: number): boolean {
    switch (rule.operator) {
      case ComparisonOperator.Equal:
        return value === rule.value;
      case ComparisonOperator.LessThan:
        return value < rule.value;
      case ComparisonOperator.GreaterThan:
        return value > rule.value;
      case ComparisonOperator.LessThanOrEqual:
        return value <= rule.value;
      case ComparisonOperator.GreaterThanOrEqual:
        return value >= rule.value;
      default:
        return false;
    }
  }
}
