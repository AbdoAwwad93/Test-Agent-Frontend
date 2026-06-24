import { RunRecord } from "@/lib/api";

interface RunHeaderProps {
  run: RunRecord | null;
  runId: string;
  liveMode: boolean;
  liveStatus: string;
  isActive: boolean;
  canceling: boolean;
  onBack: () => void;
  onCancel: () => void;
}

export function RunHeader({
  run,
  runId,
  liveMode,
  liveStatus,
  isActive,
  canceling,
  onBack,
  onCancel,
}: RunHeaderProps) {
  return (
    <header className="page-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn btn-ghost btn-icon" onClick={onBack}>
          <span className="material-icons-round">arrow_back</span>
        </button>
        <div>
          <h1 className="page-title">{liveMode ? 'Live Execution' : 'Run Details'}</h1>
          <p className="page-subtitle">{`Run #${runId.substring(0, 8)}`}</p>
        </div>
      </div>

      {!liveMode && run?.overall_status && (
        <div className={`verdict-badge ${run.overall_status}`}>
          {run.overall_status.toUpperCase()}
        </div>
      )}

      {liveMode && (
        <div className="live-controls">
          <div className="status-pill">
            <span
              className={`dot ${
                liveStatus === 'running' ? 'running' : liveStatus === 'cancel_requested' ? 'warn' : 'idle'
              }`}
            ></span>
            <span>
              {liveStatus === 'running'
                ? 'Running'
                : liveStatus === 'cancel_requested'
                ? 'Cancel Requested'
                : 'Disconnected'}
            </span>
          </div>
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