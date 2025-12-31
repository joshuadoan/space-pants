import type { Inventory, Stats } from "../entities/Meeple";
import type { Rule, Rules } from "../rules/rules";
import { evaluateCondition } from "../rules/rules";
import {
  VitalsType,
  MiningType,
  ProductType,
  CurrencyType,
} from "../entities/types";
import { IconComponent } from "../utils/iconMap";
import cx from "classnames";

export const RulesVisualizer = ({
  rules,
  stats,
  inventory,
  currentStateName,
}: {
  rules: {
    rules: Rule[];
    generators: Rule[];
  };
  stats: Stats;
  inventory: Inventory;
  currentStateName: "idle" | "traveling" | "visiting" | "transacting";
}) => {
  console.log(rules, stats, inventory, currentStateName);
  return <div className="flex flex-col md:flex-row gap-4 p-2"></div>;
};
