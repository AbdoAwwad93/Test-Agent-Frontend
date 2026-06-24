import { type RunRecord } from '@/lib/api';
import { getStatusDotState, getStatusLabel } from '../helpers/runDetailsHelper';

interface RunHeaderProps {
  run: RunRecord | null;
  runId: string;
  liveMode: boolean;
  liveStatus: string;
  isActive: boolean;
  showControls: boolean;
  canceling: boolean;
  onBack: () => void;
  onCancel: () => void;
  onPause?: () => void;
  onResume?: () => void;
  pausing?: boolean;
  resuming?: boolean;
}

export function RunHeader({
  run,
  runId,
  liveMode,
  liveStatus,
  isActive,
  showControls,
  canceling,
  onBack,
  onCancel,
  onPause,
  onResume,
  pausing,
  resuming,
}: RunHeaderProps) {
  const dotState = getStatusDotState(liveStatus);
  const statusLabel = getStatusLabel(liveStatus, run);

  return (
    <header className="page-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn btn-ghost btn-icon" onClick={onBack}>
          <span className="material-icons-round">arrow_back</span>
        </button>
        <div>
          <h1 className="page-title">{liveMode ? 'Live Execution' : 'Run Details'}</h1>
          <p className="page-subtitle">{run?.story || `Run #${runId}`}</p>
        </div>
      </div>

      {!liveMode && !showControls && run?.overall_status && (
        <div className={`verdict-badge ${run.overall_status}`}>
          {run.overall_status.toUpperCase()}
        </div>
      )}

      {showControls && (
        <div className="live-controls">
          <div className="status-pill">
            <span className={`dot ${dotState}`}></span>
            <span>{statusLabel}</span>
          </div>

          {isActive && run && !run.paused && (
            <button
              className="btn btn-secondary"
              onClick={onPause}
              disabled={canceling || pausing || run.overall_status === 'pause_requested'}
            >
              <span className="material-icons-round">pause_circle</span>
              {pausing ? 'Pausing...' : 'Pause'}
            </button>
          )}

          {run?.paused && (
            <button className="btn btn-secondary" onClick={onResume} disabled={resuming ?? false}>
              <span className="material-icons-round">play_circle</span>
              {resuming ? 'Resuming...' : 'Resume'}
            </button>
          )}

          {isActive && (
            <button className="btn btn-secondary" onClick={onCancel} disabled={canceling}>
              <span className="material-icons-round">stop_circle</span>
              {canceling ? 'Requesting Cancel...' : 'Cancel Run'}
            </button>
          )}
        </div>
      )}
    </header>
  );
}