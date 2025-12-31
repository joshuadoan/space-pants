import type { Inventory, Stats } from "../entities/Meeple";
import type { Rules } from "../rules/rules";
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
  rules: Rules;
  stats: Stats;
  inventory: Inventory;
  currentStateName: "idle" | "traveling" | "visiting" | "transacting";
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-2">
      {Object.entries(rules).map(([stateName, stateRules]) => {

        if (stateRules.length === 0) return null;
        return (
          <div key={stateName} className="flex flex-col gap-2">
            <h5 className="text-sm font-semibold text-secondary uppercase tracking-wide flex items-center gap-2">
              <div
                className={cx("w-2 h-2 rounded-full shrink-0", {
                  "bg-success animate-pulse": stateName === currentStateName,
                  "bg-gray-400": stateName !== currentStateName,
                })}
              />{" "}
              {stateName}
            </h5>
            <div className="flex flex-col gap-2 w-xs">
              {stateRules.map((rule) => {
                const conditionMet = evaluateCondition(
                  rule.property,
                  rule.operator,
                  rule.value,
                  inventory,
                  stats
                );
                const isActive = conditionMet && stateName === currentStateName;

                const currentValue = Object.values(VitalsType).includes(
                  rule.property as VitalsType
                )
                  ? stats[rule.property as VitalsType]
                  : inventory[
                      rule.property as MiningType | ProductType | CurrencyType
                    ];

                return (
                  <div
                    key={rule.name}
                    className={cx(
                      "p-2 rounded-lg border-2 transition-all duration-200",
                      {
                        "bg-success/20 border-success/50 shadow-sm shadow-success/20":
                          isActive,
                        "bg-base-100 border-base-300 opacity-60": !isActive,
                      }
                    )}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={cx("font-semibold text-sm", {
                              "text-success": isActive,
                              "": !isActive,
                            })}
                          >
                            {rule.name}
                          </span>
                          {isActive && (
                            <span className="badge badge-success badge-sm">
                              Active
                            </span>
                          )}
                        </div>

                        <p className="text-xs  mb-2">{rule.description}</p>

                        {/* Condition Display */}
                        <div className="flex items-center gap-2 p-2 bg-base-200 rounded text-xs">
                          <IconComponent
                            icon={rule.property}
                            size={14}
                            className="text-secondary shrink-0"
                          />
                          <span className="font-mono font-semibold text-secondary">
                            {currentValue}
                          </span>
                          <span
                            className={cx("font-mono", {
                              "text-success": isActive,
                              "text-gray-500": !isActive,
                            })}
                          >
                            {rule.operator}
                          </span>
                          <span className="font-mono text-gray-500">
                            {rule.value}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
