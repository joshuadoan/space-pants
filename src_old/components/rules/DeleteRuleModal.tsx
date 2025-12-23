import { useEffect, useRef } from "react";
import type { RuleId } from "../../entities/types";

interface DeleteRuleModalProps {
  ruleId: RuleId | null;
  ruleNumber: number | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteRuleModal({
  ruleId,
  ruleNumber,
  onConfirm,
  onCancel,
}: DeleteRuleModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (ruleId && modalRef.current) {
      modalRef.current.showModal();
    } else if (!ruleId && modalRef.current) {
      modalRef.current.close();
    }
  }, [ruleId]);

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Delete Rule</h3>
        <p className="py-4">
          Are you sure you want to delete Rule {ruleNumber}? This action cannot
          be undone.
        </p>
        <div className="modal-action">
          <form method="dialog">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
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
  );
}

