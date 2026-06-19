"use client";

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { isRunActive } from '@/lib/api';

import { useState } from 'react';

import { DetailedExecutionLog } from '@/features/runDetails/components/DetailedExectionLog';
import { useRun } from '@/hooks/Userun';
import { useCancelRun } from '@/hooks/Usecancelrun';
import { useRunStream } from '@/hooks/Userunstream';
import { RunMeta } from '@/features/runDetails/components/RunMeta';
import { RunHeader } from '@/features/runDetails/components/RunHeder';
import { LiveExecutionLog } from '@/features/runDetails/components/LiveExecutionLog';

export default function RunDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [openSteps, setOpenSteps] = useState<Set<number>>(new Set());

  const { data: run, isLoading, error: fetchError } = useRun(id);

  const isActive = run ? isRunActive(run) : false;

  const { steps: liveSteps, liveStatus, streamError, isStreaming } = useRunStream(id, isActive);

  const cancelMutation = useCancelRun(id);

  const liveMode = isActive && isStreaming;
  const steps = liveMode ? liveSteps : (run?.steps ?? []);
  const error = streamError || (fetchError instanceof Error ? fetchError.message : '');

  const toggleStep = (idx: number) => {
    setOpenSteps((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleCancel = () => {
    if (!run || cancelMutation.isPending) return;
    cancelMutation.mutate('Stopped by user from dashboard');
  };

  if (isLoading) {
    return <div className="page active" style={{ padding: '4rem' }}>Loading run data...</div>;
  }

  if (fetchError && !run) {
    return (
      <div className="page active" style={{ padding: '4rem' }}>
        <div className="form-error">
          <span className="material-icons-round">error_outline</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page active">
      <RunHeader
        run={run ?? null}
        runId={id}
        liveMode={liveMode}
        liveStatus={liveStatus}
        isActive={isActive}
        canceling={cancelMutation.isPending}
        onBack={() => router.replace('/dashboard')}
        onCancel={handleCancel}
      />

      {run && <RunMeta run={run} runId={id} liveMode={liveMode} />}

      {liveMode && (
        <div className="progress-wrap">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min((steps.length / 25) * 100, 100)}%` }}
            ></div>
          </div>
          <span className="progress-label">{steps.length} steps recorded</span>
        </div>
      )}

      {!liveMode && run?.summary && (
        <div className="Tester-block">
          <div className="Tester-label">
            <span className="material-icons-round">psychology</span> Tester Analysis
          </div>
          <p className="Tester-text">{run.summary}</p>
        </div>
      )}

      <div className="section-header">
        <h2 className="section-title">Execution Log</h2>
        <span className="section-count">{steps.length} steps</span>
      </div>

      <div
        className={liveMode ? 'log-container' : 'execution-log'}
        style={liveMode ? {} : { maxHeight: 'none', background: 'transparent', padding: 0 }}
      >
        {liveMode ? (
          <LiveExecutionLog steps={steps} />
        ) : (
          <DetailedExecutionLog
            steps={steps}
            runId={id}
            openSteps={openSteps}
            onToggleStep={toggleStep}
          />
        )}
      </div>

      {error && liveMode && (
        <div className="form-error" style={{ marginTop: '1rem' }}>
          <span className="material-icons-round">error_outline</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}