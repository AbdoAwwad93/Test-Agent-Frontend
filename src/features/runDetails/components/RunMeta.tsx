import { type RunRecord } from '@/lib/api';

interface RunMetaProps {
  run: RunRecord;
  runId: string;
  liveMode: boolean;
}

export function RunMeta({ run, runId, liveMode }: RunMetaProps) {
  return (
    <div className="run-meta-row" style={{ marginBottom: '2rem' }}>
      <span className="meta-tag">
        <span className="material-icons-round">link</span>
        {run.url}
      </span>
      {!liveMode && (
        <>
          <span className="meta-tag">
            <span className="material-icons-round">timer</span>
            {run.total_duration_ms ? (run.total_duration_ms / 1000).toFixed(1) + 's' : '—'}
          </span>
          <span className="meta-tag">
            <span className="material-icons-round">checklist</span>
            {run.passed || 0} passed / {run.failed || 0} failed
          </span>
        </>
      )}
      {run.canceled && (
        <span className="meta-tag">
          <span className="material-icons-round">block</span>
          {run.cancel_reason || 'Canceled'}
        </span>
      )}
      {run.paused && (
        <span className="meta-tag">
          <span className="material-icons-round">pause_circle</span>
          Paused
        </span>
      )}
      <span className="meta-tag">
        <span className="material-icons-round">tag</span>#{runId.substring(0, 8)}
      </span>
    </div>
  );
}