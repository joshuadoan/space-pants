import type { Inventory, MeepleStateName, Stats } from "../entities/Meeple";
import type { Rule } from "../rules/rules";
import { evaluateCondition } from "../rules/rules";
import { IconComponent } from "../utils/iconMap";
import cx from "classnames";

type RuleItemProps = {
  rule: Rule;
  isActive: boolean;
};

const RuleItem = ({ rule, isActive }: RuleItemProps) => {
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
  stateName: MeepleStateName;
};

const RulesSection = ({
  title,
  rules,
  stats,
  inventory,
  stateName,
}: RulesSectionProps) => {
  const rulesArray = rules || [];

  // Find the first rule that passes its condition
  let firstActiveIndex = -1;
  for (let i = 0; i < rulesArray.length; i++) {
    const rule = rulesArray[i];
    if (
      evaluateCondition(
        stateName,
        rule.property,
        rule.operator,
        rule.value,
        inventory,
        stats,
        rule.allowedStates
      )
    ) {
      firstActiveIndex = i;
      break;
    }
  }

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
    <div className="flex flex-col gap-4">
      {rulesArray.map((rule, index) => (
        <RuleItem
          key={index}
          rule={rule}
          isActive={index === firstActiveIndex}
        />
      ))}
    </div>
  );
};

export const RulesVisualizer = ({
  className,
  rules = [],
  stats,
  inventory,
  stateName,
}: {
  className?: string;
  rules: Rule[];
  stats: Stats;
  inventory: Inventory;
  stateName: MeepleStateName;
}) => {
  return (
    <div className={cx("flex flex-col gap-4", className)}>
      <RulesSection
        title="Rules"
        rules={rules}
        stats={stats}
        inventory={inventory}
        stateName={stateName}
      />
    </div>
  );
};
