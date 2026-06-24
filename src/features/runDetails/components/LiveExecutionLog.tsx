/* eslint-disable @typescript-eslint/no-explicit-any */
import { type RunStep, getRoleBadgeColor } from '@/lib/api';
import { getStepKey } from '@/utils/stepMerge';

interface LiveExecutionLogProps {
  steps: RunStep[];
  targets?: { url: string; role?: string | null }[];
}

export function LiveExecutionLog({ steps, targets }: LiveExecutionLogProps) {
  if (steps.length === 0) {
    return (
      <div className="log-empty">
        <span className="material-icons-round">terminal</span>
        <p>Awaiting steps...</p>
      </div>
    );
  }

  const showTargetBadge = targets && targets.length > 1;

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
        const ti = step.target_index ?? 0;
        const targetRole = targets && targets[ti]?.role;

        return (
          <div key={stepKey} className="log-entry">
            <span className={`material-icons-round log-icon ${step.status}`}>{icon}</span>
            <div className="log-body">
              <div className="log-action">
                {showTargetBadge && targetRole && (
                  <span
                    style={{
                      background: getRoleBadgeColor(targetRole),
                      color: '#fff', borderRadius: '999px', padding: '0 0.4rem',
                      fontSize: '0.65rem', lineHeight: '1.2rem', marginRight: '0.35rem',
                    }}
                  >
                    {targetRole}
                  </span>
                )}
                {step.action}
              </div>
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