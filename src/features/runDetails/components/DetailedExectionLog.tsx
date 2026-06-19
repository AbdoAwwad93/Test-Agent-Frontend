/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getScreenshotUrl, type RunStep } from '@/lib/api';
import { getStepKey, getStepOrder } from '@/utils/stepMerge';

interface DetailedExecutionLogProps {
  steps: RunStep[];
  runId: string;
  openSteps: Set<number>;
  onToggleStep: (idx: number) => void;
}

export function DetailedExecutionLog({
  steps,
  runId,
  openSteps,
  onToggleStep,
}: DetailedExecutionLogProps) {
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
              : 'radio_button_unchecked';
        const stepOrder = getStepOrder(step, i);
        const stepKey = getStepKey(step, i);
        const isOpen = openSteps.has(i);
        const ssrc = getScreenshotUrl(runId, step.screenshot);

        return (
          <div key={stepKey} className={`exec-step ${isOpen ? 'open' : ''}`}>
            <div className="exec-step-header" onClick={() => onToggleStep(i)}>
              <span className="step-num">{String(stepOrder + 1).padStart(2, '0')}</span>
              <span className="step-action-badge">{step.action}</span>
              <span className="step-desc">{step.description}</span>
              <span className={`material-icons-round step-status-icon ${step.status}`}>{icon}</span>
              <span className="step-dur">
                {step.duration_ms ? (step.duration_ms / 1000).toFixed(1) + 's' : ''}
              </span>
            </div>
            <div className="exec-step-body" style={{ display: isOpen ? 'flex' : 'none' }}>
              {step.error && <div className="step-error-box">{step.error}</div>}
              {step.target && (
                <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  target: {step.target}
                </div>
              )}
              {step.value && (
                <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  value: {step.value}
                </div>
              )}
              {ssrc && (
                <div className="step-screenshot">
                  <img src={ssrc} alt={`Screenshot step ${stepOrder + 1}`} loading="lazy" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}