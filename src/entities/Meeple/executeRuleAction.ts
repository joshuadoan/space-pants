import type { Meeple } from "./Meeple";
import { LogicRuleActionType, type LogicRule } from "../types";
import { executeMineOre } from "./executeMineOre";
import { executeTradeOreForMoney } from "./executeTradeOreForMoney";
import { executeSocialize } from "./executeSocialize";
import { executeWork } from "./executeWork";
import { executeGoShopping } from "./executeGoShopping";
import { executeGoSelling } from "./executeGoSelling";
import { executeChillingAtHome } from "./executeChillingAtHome";
import { executePatrol } from "./executePatrol";
import { executeGoToPirateDen } from "./executeGoToPirateDen";

export function executeRuleAction(meeple: Meeple, rule: LogicRule): void {
  switch (rule.action) {
    case LogicRuleActionType.MineOreFromAsteroid:
      executeMineOre(meeple, rule.destinationName, rule.destinationType);
      break;
    case LogicRuleActionType.SellOreToStation:
      executeTradeOreForMoney(meeple, rule.destinationName, rule.destinationType);
      break;
    case LogicRuleActionType.SocializeAtBar:
      executeSocialize(meeple, rule.destinationName, rule.destinationType);
      break;
    case LogicRuleActionType.WorkAtBar:
      executeWork(meeple, rule.destinationName, rule.destinationType);
      break;
    case LogicRuleActionType.BuyProductFromStation:
      executeGoShopping(meeple, rule.productType, rule.destinationName, rule.destinationType);
      break;
    case LogicRuleActionType.SellProductToStation:
      executeGoSelling(meeple, rule.productType, rule.destinationName, rule.destinationType);
      break;
    case LogicRuleActionType.RestAtApartments:
      executeChillingAtHome(meeple, rule.destinationName, rule.destinationType);
      break;
    case LogicRuleActionType.Patrol:
      executePatrol(meeple);
      break;
    case LogicRuleActionType.GoToPirateDen:
      executeGoToPirateDen(meeple, rule.destinationName, rule.destinationType);
      break;
  }
}

