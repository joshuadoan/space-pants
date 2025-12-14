import { IconTrash, IconX } from "@tabler/icons-react";

interface RuleFormActionsProps {
  saveStatus: "idle" | "saving" | "saved";
  internalMode: "edit" | "create";
  selectedBehavior: string;
  isCustomBehavior: boolean;
  hasInvalidRules?: boolean;
  onDeleteBehavior?: () => void;
  onCancel?: () => void;
}

export function RuleFormActions({
  saveStatus,
  internalMode,
  selectedBehavior,
  isCustomBehavior,
  hasInvalidRules = false,
  onDeleteBehavior,
  onCancel,
}: RuleFormActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 justify-end mt-2">
      {internalMode === "edit" &&
        selectedBehavior &&
        isCustomBehavior &&
        onDeleteBehavior && (
          <button
            type="button"
            onClick={onDeleteBehavior}
            className="btn btn-error btn-outline w-full sm:w-auto"
          >
            <IconTrash size={14} className="mr-1" />
            Delete Rules
          </button>
        )}
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost w-full sm:w-auto"
        >
          <IconX size={14} className="mr-1" />
          Cancel
        </button>
      )}
      <button
        type="submit"
        className={`btn btn-primary w-full sm:w-auto transition-all duration-300 ${
          saveStatus === "saving"
            ? "loading"
            : saveStatus === "saved"
            ? "btn-success"
            : ""
        }`}
        disabled={saveStatus === "saving" || hasInvalidRules}
        title={hasInvalidRules ? "Please complete all rule fields before saving" : undefined}
      >
        {saveStatus === "saving" ? (
          "Saving..."
        ) : saveStatus === "saved" ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Saved!
          </>
        ) : internalMode === "create" ? (
          "Save as Behavior"
        ) : (
          "Save Rules"
        )}
      </button>
    </div>
  );
}

