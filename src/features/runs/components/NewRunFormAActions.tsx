"use client";

interface NewRunFormActionsProps {
  cancel: () => void;
  handleSubmit: () => void;
  isPending: boolean;
  submitError: string;
}

export function NewRunFormActions({
  cancel,
  handleSubmit,
  isPending,
  submitError,
}: NewRunFormActionsProps) {
  return (
    <>
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={cancel}>
          Cancel
        </button>
        <button
          className="btn btn-primary btn-large"
          onClick={handleSubmit}
          disabled={isPending}
        >
          <span className="material-icons-round">
            {isPending ? "hourglass_empty" : "play_arrow"}
          </span>
          {isPending ? "Initiating..." : "Initiate Sequence"}
        </button>
      </div>

      {submitError && (
        <div className="form-error">
          <span className="material-icons-round">error_outline</span>
          <span>{submitError}</span>
        </div>
      )}
    </>
  );
}