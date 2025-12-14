import type { RuleBehavior, BehaviorId } from "../../entities/types";
import { BUILT_IN_BEHAVIORS } from "../../entities/ruleTemplates";

interface BehaviorSelectorProps {
  selectedBehavior: BehaviorId | "";
  customBehaviors: RuleBehavior[];
  onBehaviorChange: (behaviorId: string) => void;
}

export function BehaviorSelector({
  selectedBehavior,
  customBehaviors,
  onBehaviorChange,
}: BehaviorSelectorProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <label className="label py-1">
          <span className="label-text text-xs text-base-content/70">
            Rule Behavior
          </span>
        </label>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={selectedBehavior}
          onChange={(e) => onBehaviorChange(e.target.value)}
          className="select select-primary select-bordered flex-1"
        >
          <option value="" disabled>
            Select a behavior...
          </option>
          {BUILT_IN_BEHAVIORS.length > 0 && (
            <optgroup label="Built-in Behaviors">
              {BUILT_IN_BEHAVIORS.map((behavior) => (
                <option key={behavior.id} value={behavior.id}>
                  {behavior.name}
                </option>
              ))}
            </optgroup>
          )}
          {customBehaviors.length > 0 && (
            <optgroup label="Custom Behaviors">
              {customBehaviors.map((behavior) => (
                <option key={behavior.id} value={behavior.id}>
                  {behavior.name}
                </option>
              ))}
            </optgroup>
          )}
        </select>
      </div>
    </>
  );
}

