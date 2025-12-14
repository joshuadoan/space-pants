import { useRef, useReducer, useEffect } from "react";
import type { LogicRule } from "../entities/types";
import { BUILT_IN_BEHAVIORS } from "../entities/ruleTemplates";
import { useToast } from "./Toast";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ComparisonOperator, LogicRuleActionType } from "../entities/types";
import { DraggableRuleItem } from "./rules/DraggableRuleItem";
import { BehaviorSelector } from "./rules/BehaviorSelector";
import { RulesListNameInput } from "./rules/RulesListNameInput";
import { RuleFormActions } from "./rules/RuleFormActions";
import { rulesFormReducer } from "./rules/rulesFormReducer";
import {
  loadCustomBehaviors,
  saveCustomBehaviors,
} from "./rules/behaviorStorage";
import {
  createDefaultRule,
  createNewRule,
} from "./rules/ruleUtils";
import { useGame } from "../hooks/useGame";

export function RulesForm({
  rules,
  onUpdateRules,
  onCancel,
  mode = "edit",
}: {
  rules: LogicRule[];
  onUpdateRules: (rules: LogicRule[]) => void;
  onCancel?: () => void;
  mode?: "edit" | "create";
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, dispatch] = useReducer(rulesFormReducer, {
    localRules: mode === "create" && rules.length === 0 ? [createDefaultRule()] : rules,
    selectedBehavior: "",
    saveStatus: "idle",
    customBehaviors: [],
    rulesListName: "",
    internalMode: mode,
  });
  const { showToast } = useToast();
  const { meeples } = useGame();

  // Update internal mode when prop changes
  useEffect(() => {
    const prevMode = state.internalMode;
    dispatch({ type: "set-internal-mode", payload: mode });
    // Initialize create mode with default rule when switching to create mode
    if (mode === "create" && prevMode !== "create") {
      dispatch({ type: "set-local-rules", payload: [createDefaultRule()] });
      dispatch({ type: "set-selected-behavior", payload: "" });
      dispatch({ type: "set-rules-list-name", payload: "" });
    }
  }, [mode, state.internalMode]);

  // Load custom behaviors on mount
  useEffect(() => {
    dispatch({
      type: "set-custom-behaviors",
      payload: loadCustomBehaviors(),
    });
  }, []);

  // Get all behaviors (built-in + custom)
  const allBehaviors = [
    ...BUILT_IN_BEHAVIORS,
    ...state.customBehaviors,
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (state.internalMode === "create") {
      // In create mode, save to behaviors
      if (!state.rulesListName.trim()) {
        showToast("Please enter a name for the behavior", "error");
        return;
      }

      // Check if name already exists
      if (
        allBehaviors.some(
          (b) =>
            b.name.toLowerCase() === state.rulesListName.trim().toLowerCase()
        )
      ) {
        showToast("A behavior with this name already exists", "error");
        return;
      }

      // Generate a unique ID for the custom behavior
      const behaviorId = `custom-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;

      const newBehavior = {
        id: behaviorId,
        name: state.rulesListName.trim(),
        rules: state.localRules,
      };

      const updatedCustomBehaviors = [...state.customBehaviors, newBehavior];
      dispatch({
        type: "set-custom-behaviors",
        payload: updatedCustomBehaviors,
      });
      saveCustomBehaviors(updatedCustomBehaviors);

      dispatch({ type: "set-save-status", payload: "saving" });
      setTimeout(() => {
        dispatch({ type: "set-save-status", payload: "saved" });
        showToast(`Behavior "${newBehavior.name}" saved successfully!`, "success");
        setTimeout(() => {
          dispatch({ type: "set-save-status", payload: "idle" });
          // Reset form after successful save
          dispatch({ type: "set-rules-list-name", payload: "" });
          dispatch({ type: "set-local-rules", payload: [createDefaultRule()] });
        }, 2000);
      }, 100);
    } else {
      // In edit mode, just save the rules
      dispatch({ type: "set-save-status", payload: "saving" });
      onUpdateRules(state.localRules);

      // Show success feedback after a brief delay
      setTimeout(() => {
        dispatch({ type: "set-save-status", payload: "saved" });
        showToast("Rules saved successfully!", "success");
        // Reset button state after showing success
        setTimeout(() => {
          dispatch({ type: "set-save-status", payload: "idle" });
        }, 2000);
      }, 100);
    }
  };

  const handleOperatorChange = (
    ruleId: string,
    operator: ComparisonOperator
  ) => {
    dispatch({
      type: "update-rule-operator",
      payload: { ruleId, operator },
    });
  };

  const handleGoodChange = (ruleId: string, good: string) => {
    dispatch({
      type: "update-rule-good",
      payload: { ruleId, good },
    });
  };

  const handleValueChange = (ruleId: string, value: number) => {
    dispatch({
      type: "update-rule-value",
      payload: { ruleId, value },
    });
  };

  const handleActionChange = (ruleId: string, action: LogicRuleActionType) => {
    dispatch({
      type: "update-rule-action",
      payload: { ruleId, action },
    });
  };

  const handleDestinationTypeChange = (ruleId: string, destinationType?: string) => {
    dispatch({
      type: "update-rule-destination-type",
      payload: { ruleId, destinationType: destinationType ? (destinationType as any) : undefined },
    });
  };

  const handleDestinationNameChange = (ruleId: string, destinationName?: string) => {
    dispatch({
      type: "update-rule-destination-name",
      payload: { ruleId, destinationName: destinationName?.trim() || undefined },
    });
  };

  const handleBehaviorChange = (behaviorId: string) => {
    if (behaviorId) {
      const behavior = allBehaviors.find((b) => b.id === behaviorId);
      if (behavior) {
        dispatch({
          type: "load-behavior",
          payload: { behavior, behaviorId },
        });
      }
    } else {
      dispatch({ type: "set-selected-behavior", payload: "" });
      dispatch({ type: "set-rules-list-name", payload: "" });
    }
  };

  const handleDeleteCustomBehavior = (behaviorId: string) => {
    const updatedCustomBehaviors = state.customBehaviors.filter(
      (b) => b.id !== behaviorId
    );
    dispatch({
      type: "set-custom-behaviors",
      payload: updatedCustomBehaviors,
    });
    saveCustomBehaviors(updatedCustomBehaviors);

    // If the deleted behavior was selected, clear selection
    if (state.selectedBehavior === behaviorId) {
      dispatch({ type: "set-selected-behavior", payload: "" });
    }

    showToast("Behavior deleted", "success");
  };

  const handleDeleteRule = (ruleId: string) => {
    dispatch({ type: "delete-rule", payload: ruleId });
  };

  const handleMoveRule = (dragIndex: number, hoverIndex: number) => {
    dispatch({
      type: "move-rule",
      payload: { dragIndex, hoverIndex },
    });
  };

  const handleAddRule = () => {
    dispatch({ type: "add-rule", payload: createNewRule() });
  };

  const isCustomBehavior = Boolean(
    state.selectedBehavior &&
    state.customBehaviors.some((b) => b.id === state.selectedBehavior)
  );

  return (
    <div className="w-full">
      <DndProvider backend={HTML5Backend}>
        <form
          onSubmit={handleSubmit}
          ref={formRef}
          className="flex flex-col gap-4"
        >
          <div className="w-full space-y-2">
            {state.internalMode === "create" && (
              <RulesListNameInput
                value={state.rulesListName}
                onChange={(value) =>
                  dispatch({
                    type: "set-rules-list-name",
                    payload: value,
                  })
                }
              />
            )}
            {state.internalMode === "edit" && (
              <BehaviorSelector
                selectedBehavior={state.selectedBehavior}
                customBehaviors={state.customBehaviors}
                onBehaviorChange={handleBehaviorChange}
              />
            )}
          </div>
          {state.localRules.map((rule, index) => (
            <DraggableRuleItem
              key={rule.id}
              rule={rule}
              index={index}
              meeples={meeples}
              onMoveRule={handleMoveRule}
              onOperatorChange={handleOperatorChange}
              onGoodChange={handleGoodChange}
              onValueChange={handleValueChange}
              onActionChange={handleActionChange}
              onDestinationTypeChange={handleDestinationTypeChange}
              onDestinationNameChange={handleDestinationNameChange}
              onDeleteRule={handleDeleteRule}
            />
          ))}
          {(state.internalMode === "create" || 
            (state.internalMode === "edit" && state.selectedBehavior)) && (
            <div className="flex justify-start mt-2">
              <button
                type="button"
                onClick={handleAddRule}
                className="btn btn-secondary w-full sm:w-auto"
              >
                Add New Rule
              </button>
            </div>
          )}
          <RuleFormActions
            saveStatus={state.saveStatus}
            internalMode={state.internalMode}
            selectedBehavior={state.selectedBehavior}
            isCustomBehavior={isCustomBehavior}
            onDeleteBehavior={
              state.selectedBehavior
                ? () => handleDeleteCustomBehavior(state.selectedBehavior)
                : undefined
            }
            onCancel={onCancel}
          />
        </form>
      </DndProvider>
    </div>
  );
}
