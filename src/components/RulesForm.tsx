import { useEffect, useMemo, useReducer, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { useGame } from "../hooks/useGame";
import {
  ComparisonOperator,
  LogicRuleActionType,
  MeepleType,
  createBehaviorId,
  type BehaviorId,
  type LogicRule,
  type RuleId,
} from "../entities/types";
import { BUILT_IN_BEHAVIORS, mergeRulesWithDefaults } from "../entities/ruleTemplates";
import { BehaviorSelector } from "./rules/BehaviorSelector";
import { DeleteRuleModal } from "./rules/DeleteRuleModal";
import { DraggableRuleItem } from "./rules/DraggableRuleItem";
import { RuleFormActions } from "./rules/RuleFormActions";
import { RulesListNameInput } from "./rules/RulesListNameInput";
import {
  loadCustomBehaviors,
  saveCustomBehaviors,
} from "./rules/behaviorStorage";
import { rulesFormReducer } from "./rules/rulesFormReducer";
import {
  createDefaultRule,
  createNewRule,
} from "./rules/ruleUtils";
import {
  behaviorNameExists,
  behaviorStillMatches,
  findMatchingBehavior,
  generateBehaviorId,
  validateRules,
} from "./rules/rulesFormUtils";
import { useToast } from "./Toast";

export function RulesForm({
  rules,
  onUpdateRules,
  onCancel,
  mode = "edit",
  meepleType,
}: {
  rules: LogicRule[];
  onUpdateRules: (rules: LogicRule[]) => void;
  onCancel?: () => void;
  mode?: "edit" | "create";
  meepleType?: MeepleType;
}) {
  // Filter out required rules from display (they're always included automatically)
  const initialRules = mode === "create" && rules.length === 0 
    ? [createDefaultRule()] 
    : rules.filter(rule => !rule.required);
  const [state, dispatch] = useReducer(rulesFormReducer, {
    localRules: initialRules,
    selectedBehavior: "",
    saveStatus: "idle",
    customBehaviors: [],
    rulesListName: "",
    internalMode: mode,
  });
  const [deleteRuleState, setDeleteRuleState] = useState<{
    ruleId: RuleId | null;
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
      const nonRequiredRules = rules.filter(rule => !rule.required);
      const stillMatches = behaviorStillMatches(
        state.selectedBehavior,
        nonRequiredRules,
        allBehaviors
      );
      
      if (!state.selectedBehavior || !stillMatches) {
        const matchingBehaviorId = findMatchingBehavior(nonRequiredRules, allBehaviors);
        if (matchingBehaviorId) {
          dispatch({ type: "set-selected-behavior", payload: matchingBehaviorId });
        } else if (!stillMatches) {
          dispatch({ type: "set-selected-behavior", payload: "" });
        }
      }
    }
  }, [rules, state.customBehaviors, state.internalMode, state.selectedBehavior, mode, allBehaviors]);

  const validationResult = validateRules(state.localRules);
  const hasInvalidRules = !validationResult.isValid;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (state.internalMode === "edit" && meepleType !== undefined && meepleType !== MeepleType.Custom) {
      showToast("Only custom types can update behaviors/rules", "error");
      return;
    }

    if (hasInvalidRules) {
      const errorMessage = validationResult.errors[0] || "Please complete all rule fields before saving";
      showToast(errorMessage, "error");
      return;
    }

    if (state.internalMode === "create") {
      handleCreateBehavior();
    } else {
      handleUpdateRules();
    }
  };

  const handleCreateBehavior = () => {
    if (!state.rulesListName.trim()) {
      showToast("Please enter a name for the behavior", "error");
      return;
    }

    if (behaviorNameExists(state.rulesListName, allBehaviors)) {
      showToast("A behavior with this name already exists", "error");
      return;
    }

    const behaviorId = generateBehaviorId();
    const behaviorRules = state.localRules.filter(rule => !rule.required);
    const newBehavior = {
      id: behaviorId,
      name: state.rulesListName.trim(),
      rules: behaviorRules,
    };

    const updatedCustomBehaviors = [...state.customBehaviors, newBehavior];
    dispatch({ type: "set-custom-behaviors", payload: updatedCustomBehaviors });
    saveCustomBehaviors(updatedCustomBehaviors);

    dispatch({ type: "set-save-status", payload: "saving" });
    setTimeout(() => {
      dispatch({ type: "set-save-status", payload: "saved" });
      showToast(`Behavior "${newBehavior.name}" saved successfully!`, "success");
      setTimeout(() => {
        dispatch({ type: "set-save-status", payload: "idle" });
        dispatch({ type: "set-rules-list-name", payload: "" });
        dispatch({ type: "set-local-rules", payload: [createDefaultRule()] });
      }, 2000);
    }, 100);
  };

  const handleUpdateRules = () => {
    const customRules = state.localRules.filter(rule => !rule.required);
    const rulesWithDefaults = mergeRulesWithDefaults(customRules);
    
    dispatch({ type: "set-save-status", payload: "saving" });
    onUpdateRules(rulesWithDefaults);

    setTimeout(() => {
      dispatch({ type: "set-save-status", payload: "saved" });
      showToast("Rules saved successfully!", "success");
      setTimeout(() => {
        dispatch({ type: "set-save-status", payload: "idle" });
        onCancel?.();
      }, 2000);
    }, 100);
  };

  const handleOperatorChange = (
    ruleId: RuleId,
    operator: ComparisonOperator
  ) => {
    dispatch({
      type: "update-rule-operator",
      payload: { ruleId, operator },
    });
  };

  const handleGoodChange = (ruleId: RuleId, good: string) => {
    dispatch({
      type: "update-rule-good",
      payload: { ruleId, good },
    });
  };

  const handleValueChange = (ruleId: RuleId, value: number) => {
    dispatch({
      type: "update-rule-value",
      payload: { ruleId, value },
    });
  };

  const handleActionChange = (ruleId: RuleId, action: LogicRuleActionType) => {
    dispatch({
      type: "update-rule-action",
      payload: { ruleId, action },
    });
  };

  const handleDestinationTypeChange = (ruleId: RuleId, destinationType?: string) => {
    dispatch({
      type: "update-rule-destination-type",
      payload: { ruleId, destinationType: destinationType ? (destinationType as MeepleType) : undefined },
    });
  };

  const handleDestinationNameChange = (ruleId: RuleId, destinationName?: string) => {
    dispatch({
      type: "update-rule-destination-name",
      payload: { ruleId, destinationName: destinationName?.trim() || undefined },
    });
  };

  const handleBehaviorChange = (behaviorId: string) => {
    if (behaviorId) {
      const brandedId = createBehaviorId(behaviorId);
      const behavior = allBehaviors.find((b) => b.id === brandedId);
      if (behavior) {
        dispatch({
          type: "load-behavior",
          payload: { behavior, behaviorId: brandedId },
        });
      }
    } else {
      dispatch({ type: "set-selected-behavior", payload: "" });
      dispatch({ type: "set-rules-list-name", payload: "" });
    }
  };

  const handleDeleteCustomBehavior = (behaviorId: BehaviorId) => {
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

  const handleDeleteRule = (ruleId: RuleId) => {
    const rule = state.localRules.find((r) => r.id === ruleId);
    if (rule?.required === true) {
      showToast("Cannot delete required rules", "error");
      return;
    }
    
    const ruleIndex = state.localRules.findIndex((r) => r.id === ruleId);
    setDeleteRuleState({ ruleId, ruleNumber: ruleIndex + 1 });
  };

  const confirmDeleteRule = () => {
    if (deleteRuleState.ruleId) {
      dispatch({ type: "delete-rule", payload: deleteRuleState.ruleId });
      setDeleteRuleState({ ruleId: null, ruleNumber: null });
    }
  };

  const cancelDeleteRule = () => {
    setDeleteRuleState({ ruleId: null, ruleNumber: null });
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
            const isRuleInvalid = !rule.good || !rule.operator || 
              rule.value === undefined || rule.value === null || isNaN(rule.value) || !rule.action;
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
                ? () => handleDeleteCustomBehavior(state.selectedBehavior as BehaviorId)
                : undefined
            }
            onCancel={onCancel}
          />
        </form>
      </DndProvider>
      <DeleteRuleModal
        ruleId={deleteRuleState.ruleId}
        ruleNumber={deleteRuleState.ruleNumber}
        onConfirm={confirmDeleteRule}
        onCancel={cancelDeleteRule}
      />
    </div>
  );
}
