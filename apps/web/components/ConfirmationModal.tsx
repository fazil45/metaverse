import { AlertTriangle, X } from "lucide-react";
import Button from "./Button";
import { ConfirmationModalProps } from "../types/types";

const ConfirmationModal = ({
  isOpen,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 grid place-items-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-xl border-2 border-border bg-card p-5 shadow-2xl">
        {/* Close */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-md border border-border text-muted-foreground transition hover:bg-background hover:text-foreground"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div className="mb-4 grid size-11 place-items-center rounded-lg border-2 border-red-200 bg-red-50 text-red-600">
          <AlertTriangle size={21} />
        </div>

        {/* Content */}
        <div className="pr-8">
          <h2 className="text-lg font-semibold">{title}</h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button type="button" variant="create" onClick={onConfirm}>
            {confirmText}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
