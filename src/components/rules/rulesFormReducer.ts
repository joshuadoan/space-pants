import type {
  LogicRule,
  RuleBehavior,
  ComparisonOperator,
  LogicRuleActionType,
} from "../../entities/types";
import { Products } from "../../entities/types";

// State type
export interface RulesFormState {
  localRules: LogicRule[];
  selectedBehavior: string;
  saveStatus: "idle" | "saving" | "saved";
  customBehaviors: RuleBehavior[];
  rulesListName: string;
  internalMode: "edit" | "create";
}

// Action types
type SetLocalRulesAction = {
  type: "set-local-rules";
  payload: LogicRule[];
};

type SetSelectedBehaviorAction = {
  type: "set-selected-behavior";
  payload: string;
};

type SetSaveStatusAction = {
  type: "set-save-status";
  payload: "idle" | "saving" | "saved";
};

type SetCustomBehaviorsAction = {
  type: "set-custom-behaviors";
  payload: RuleBehavior[];
};

type SetRulesListNameAction = {
  type: "set-rules-list-name";
  payload: string;
};

type SetInternalModeAction = {
  type: "set-internal-mode";
  payload: "edit" | "create";
};

type UpdateRuleOperatorAction = {
  type: "update-rule-operator";
  payload: { ruleId: string; operator: ComparisonOperator };
};

type UpdateRuleGoodAction = {
  type: "update-rule-good";
  payload: { ruleId: string; good: string };
};

type UpdateRuleValueAction = {
  type: "update-rule-value";
  payload: { ruleId: string; value: number };
};

type UpdateRuleActionAction = {
  type: "update-rule-action";
  payload: { ruleId: string; action: LogicRuleActionType };
};

type UpdateRuleProductTypeAction = {
  type: "update-rule-product-type";
  payload: { ruleId: string; productType?: Products };
};

type DeleteRuleAction = {
  type: "delete-rule";
  payload: string;
};

type MoveRuleAction = {
  type: "move-rule";
  payload: { dragIndex: number; hoverIndex: number };
};

type AddRuleAction = {
  type: "add-rule";
  payload: LogicRule;
};

type ResetFormAction = {
  type: "reset-form";
  payload?: { rules?: LogicRule[] };
};

type LoadBehaviorAction = {
  type: "load-behavior";
  payload: { behavior: RuleBehavior; behaviorId: string };
};

export type RulesFormAction =
  | SetLocalRulesAction
  | SetSelectedBehaviorAction
  | SetSaveStatusAction
  | SetCustomBehaviorsAction
  | SetRulesListNameAction
  | SetInternalModeAction
  | UpdateRuleOperatorAction
  | UpdateRuleGoodAction
  | UpdateRuleValueAction
  | UpdateRuleActionAction
  | UpdateRuleProductTypeAction
  | DeleteRuleAction
  | MoveRuleAction
  | AddRuleAction
  | ResetFormAction
  | LoadBehaviorAction;

/**
 * Reducer function for rules form state management
 */
export function rulesFormReducer(
  state: RulesFormState,
  action: RulesFormAction
): RulesFormState {
  switch (action.type) {
    case "set-local-rules":
      return { ...state, localRules: action.payload };
    case "set-selected-behavior":
      return { ...state, selectedBehavior: action.payload };
    case "set-save-status":
      return { ...state, saveStatus: action.payload };
    case "set-custom-behaviors":
      return { ...state, customBehaviors: action.payload };
    case "set-rules-list-name":
      return { ...state, rulesListName: action.payload };
    case "set-internal-mode":
      return { ...state, internalMode: action.payload };
    case "update-rule-operator":
      return {
        ...state,
        localRules: state.localRules.map((rule) =>
          rule.id === action.payload.ruleId
            ? { ...rule, operator: action.payload.operator }
            : rule
        ),
      };
    case "update-rule-good":
      return {
        ...state,
        localRules: state.localRules.map((rule) =>
          rule.id === action.payload.ruleId
            ? { ...rule, good: action.payload.good as typeof rule.good }
            : rule
        ),
      };
    case "update-rule-value":
      return {
        ...state,
        localRules: state.localRules.map((rule) =>
          rule.id === action.payload.ruleId
            ? { ...rule, value: action.payload.value }
            : rule
        ),
      };
    case "update-rule-action":
      return {
        ...state,
        localRules: state.localRules.map((rule) =>
          rule.id === action.payload.ruleId
            ? { ...rule, action: action.payload.action }
            : rule
        ),
      };
    case "update-rule-product-type":
      return {
        ...state,
        localRules: state.localRules.map((rule) =>
          rule.id === action.payload.ruleId
            ? { ...rule, productType: action.payload.productType }
            : rule
        ),
      };
    case "delete-rule":
      return {
        ...state,
        localRules: state.localRules.filter(
          (rule) => rule.id !== action.payload
        ),
      };
    case "move-rule":
      const newRules = [...state.localRules];
      const [draggedRule] = newRules.splice(action.payload.dragIndex, 1);
      newRules.splice(action.payload.hoverIndex, 0, draggedRule);
      return { ...state, localRules: newRules };
    case "add-rule":
      return {
        ...state,
        localRules: [...state.localRules, action.payload],
      };
    case "reset-form":
      return {
        ...state,
        localRules: action.payload?.rules ?? [],
        rulesListName: "",
        selectedBehavior: "",
      };
    case "load-behavior":
      return {
        ...state,
        localRules: action.payload.behavior.rules,
        rulesListName: action.payload.behavior.name,
        selectedBehavior: action.payload.behaviorId,
      };
    default:
      return state;
  }
}

