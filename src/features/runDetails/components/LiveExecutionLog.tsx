/* eslint-disable @typescript-eslint/no-explicit-any */
import { type RunStep } from '@/lib/api';
import { getStepKey } from '@/utils/stepMerge';

interface LiveExecutionLogProps {
  steps: RunStep[];
}

export function LiveExecutionLog({ steps }: LiveExecutionLogProps) {
  if (steps.length === 0) {
    return (
      <div className="log-empty">
        <span className="material-icons-round">terminal</span>
        <p>Awaiting steps...</p>
      </div>
    );
  }

  return (
    <>
      {steps.map((step: any, i) => {
        const icon =
          step.status === 'pass'
            ? 'check_circle'
            : step.status === 'fail'
              ? 'cancel'
              : 'autorenew';
        const stepKey = getStepKey(step, i);

        return (
          <div key={stepKey} className="log-entry">
            <span className={`material-icons-round log-icon ${step.status}`}>{icon}</span>
            <div className="log-body">
              <div className="log-action">{step.action}</div>
              <div className="log-desc">{step.description}</div>
              {step.error && <div className="log-error">{step.error}</div>}
            </div>
            {step.duration_ms !== undefined && (
              <span className="log-dur">{(step.duration_ms / 1000).toFixed(1)}s</span>
            )}
          </div>
        );
      })}
    </>
  );
}