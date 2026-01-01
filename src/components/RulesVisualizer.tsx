import type { Inventory, Stats } from "../entities/Meeple";
import type { Rule } from "../rules/rules";
import { evaluateCondition } from "../rules/rules";
import { IconComponent } from "../utils/iconMap";
import cx from "classnames";

type RuleItemProps = {
  rule: Rule;
  stats: Stats;
  inventory: Inventory;
};

const RuleItem = ({ rule, stats, inventory }: RuleItemProps) => {
  const isActive = evaluateCondition(
    rule.property,
    rule.operator,
    rule.value,
    inventory,
    stats
  );

  return (
    <div
      className={cx(
        "p-3 border rounded-md transition-all",
        isActive
          ? "border-success bg-success/10"
          : "border-base-300 bg-base-100"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm flex-1">{rule.name}</h3>
        {isActive && (
          <div className="badge badge-sm badge-success gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span>Active</span>
          </div>
        )}
      </div>
      <p className="text-xs text-base-content/70 mb-3">{rule.description}</p>
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1.5">
          <IconComponent
            icon={rule.property as any}
            size={16}
            className="text-base-content/70"
          />
          <span className="font-medium">{rule.property}</span>
        </div>
        <span className="text-base-content/50">{rule.operator}</span>
        <span className="font-semibold">{rule.value}</span>
      </div>
    </div>
  );
};

type RulesSectionProps = {
  title: string;
  rules: Rule[];
  stats: Stats;
  inventory: Inventory;
};

const RulesSection = ({ title, rules, stats, inventory }: RulesSectionProps) => {
  const rulesArray = rules || [];
  
  if (rulesArray.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-base-content/70">{title}</h2>
        <div className="text-xs text-base-content/50 p-3 border border-base-300 rounded-md">
          No {title.toLowerCase()} defined
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-base-content/70">
        {title} ({rulesArray.length})
      </h2>
      <div className="flex flex-col gap-2">
        {rulesArray.map((rule, index) => (
          <RuleItem
            key={index}
            rule={rule}
            stats={stats}
            inventory={inventory}
          />
        ))}
      </div>
    </div>
  );
};

export const RulesVisualizer = ({
  className,
  rules = [],
  stats,
  inventory,
  currentStateName,
}: {
  className?: string;
  rules: Rule[];
  stats: Stats;
  inventory: Inventory;
  currentStateName: "idle" | "traveling" | "visiting" | "transacting";
}) => {
  return (
    <div className={cx("flex flex-col gap-4 p-2", className)}>
      <div className="text-xs text-base-content/50 mb-2">
        Current state: <span className="font-semibold capitalize">{currentStateName}</span>
      </div>
      <RulesSection
        title="Rules"
        rules={rules}
        stats={stats}
        inventory={inventory}
      />
    </div>
  );
};
