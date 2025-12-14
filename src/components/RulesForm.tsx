import { useRef, useReducer, useEffect, useMemo, useState } from "react";
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
  rulesArraysEqual,
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
  const deleteModalRef = useRef<HTMLDialogElement>(null);
  const [state, dispatch] = useReducer(rulesFormReducer, {
    localRules: mode === "create" && rules.length === 0 ? [createDefaultRule()] : rules,
    selectedBehavior: "",
    saveStatus: "idle",
    customBehaviors: [],
    rulesListName: "",
    internalMode: mode,
  });
  const [deleteRuleState, setDeleteRuleState] = useState<{
    ruleId: string | null;
    ruleNumber: number | null;
  }>({ ruleId: null, ruleNumber: null });
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

  // Get all behaviors (built-in + custom) - memoized to avoid recreating on every render
  const allBehaviors = useMemo(() => [
    ...BUILT_IN_BEHAVIORS,
    ...state.customBehaviors,
  ], [state.customBehaviors]);

  // Load custom behaviors on mount
  useEffect(() => {
    const loadedBehaviors = loadCustomBehaviors();
    dispatch({
      type: "set-custom-behaviors",
      payload: loadedBehaviors,
    });
  }, []);

  // Find matching behavior when rules prop or behaviors change in edit mode
  // Only match against the original rules prop, not localRules (which change as user edits)
  useEffect(() => {
    if (mode === "edit" && state.internalMode === "edit" && rules.length > 0 && allBehaviors.length > 0) {
      // Check if current selected behavior still matches
      const currentSelectedBehavior = allBehaviors.find(
        (b) => b.id === state.selectedBehavior
      );
      const selectedStillMatches = currentSelectedBehavior && 
        rulesArraysEqual(currentSelectedBehavior.rules, rules);
      
      // If no behavior selected or selected behavior doesn't match, find a new match
      if (!state.selectedBehavior || !selectedStillMatches) {
        const matchingBehavior = allBehaviors.find((behavior) =>
          rulesArraysEqual(behavior.rules, rules)
        );
        if (matchingBehavior) {
          dispatch({
            type: "set-selected-behavior",
            payload: matchingBehavior.id,
          });
        } else if (!selectedStillMatches) {
          // Clear selection if rules don't match any behavior
          dispatch({ type: "set-selected-behavior", payload: "" });
        }
      }
    }
  }, [rules, state.customBehaviors, state.internalMode, state.selectedBehavior, mode, allBehaviors]);

  // Validate that all rules are complete
  const validateRules = (rules: LogicRule[]): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (rules.length === 0) {
      errors.push("At least one rule is required");
      return { isValid: false, errors };
    }

    rules.forEach((rule, index) => {
      if (!rule.good) {
        errors.push(`Rule ${index + 1}: Good is required`);
      }
      if (!rule.operator) {
        errors.push(`Rule ${index + 1}: Operator is required`);
      }
      if (rule.value === undefined || rule.value === null || isNaN(rule.value)) {
        errors.push(`Rule ${index + 1}: Value is required`);
      }
      if (!rule.action) {
        errors.push(`Rule ${index + 1}: Action is required`);
      }
    });

    return { isValid: errors.length === 0, errors };
  };

  const validationResult = validateRules(state.localRules);
  const hasInvalidRules = !validationResult.isValid;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate rules before saving
    if (hasInvalidRules) {
      const errorMessage = validationResult.errors.length > 0
        ? validationResult.errors[0]
        : "Please complete all rule fields before saving";
      showToast(errorMessage, "error");
      return;
    }

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
          // Exit edit mode after successful save
          if (onCancel) {
            onCancel();
          }
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
    const behavior = state.customBehaviors.find((b) => b.id === behaviorId);
    const behaviorName = behavior?.name || "this behavior";
    
    if (!window.confirm(`Are you sure you want to delete "${behaviorName}"? This action cannot be undone.`)) {
      return;
    }

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
    const ruleIndex = state.localRules.findIndex((r) => r.id === ruleId);
    const ruleNumber = ruleIndex + 1;
    
    setDeleteRuleState({ ruleId, ruleNumber });
    deleteModalRef.current?.showModal();
  };

  const confirmDeleteRule = () => {
    if (deleteRuleState.ruleId) {
      dispatch({ type: "delete-rule", payload: deleteRuleState.ruleId });
      setDeleteRuleState({ ruleId: null, ruleNumber: null });
      deleteModalRef.current?.close();
    }
  };

  const cancelDeleteRule = () => {
    setDeleteRuleState({ ruleId: null, ruleNumber: null });
    deleteModalRef.current?.close();
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
          {state.localRules.map((rule, index) => {
            const isRuleInvalid = !rule.good || !rule.operator || rule.value === undefined || rule.value === null || !rule.action;
            return (
              <DraggableRuleItem
                key={rule.id}
                rule={rule}
                index={index}
                meeples={meeples}
                isInvalid={isRuleInvalid}
                onMoveRule={handleMoveRule}
                onOperatorChange={handleOperatorChange}
                onGoodChange={handleGoodChange}
                onValueChange={handleValueChange}
                onActionChange={handleActionChange}
                onDestinationTypeChange={handleDestinationTypeChange}
                onDestinationNameChange={handleDestinationNameChange}
                onDeleteRule={handleDeleteRule}
              />
            );
          })}
          <div className="flex justify-start mt-2">
            <button
              type="button"
              onClick={handleAddRule}
              className="btn btn-secondary w-full sm:w-auto"
            >
              Add New Rule
            </button>
          </div>
          <RuleFormActions
            saveStatus={state.saveStatus}
            internalMode={state.internalMode}
            selectedBehavior={state.selectedBehavior}
            isCustomBehavior={isCustomBehavior}
            hasInvalidRules={hasInvalidRules}
            onDeleteBehavior={
              state.selectedBehavior
                ? () => handleDeleteCustomBehavior(state.selectedBehavior)
                : undefined
            }
            onCancel={onCancel}
          />
        </form>
      </DndProvider>
      <dialog ref={deleteModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Rule</h3>
          <p className="py-4">
            Are you sure you want to delete Rule {deleteRuleState.ruleNumber}? This action cannot be undone.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button
                type="button"
                onClick={cancelDeleteRule}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteRule}
                className="btn btn-error"
              >
                Delete
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
