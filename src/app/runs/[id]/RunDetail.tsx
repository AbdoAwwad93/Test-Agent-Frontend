"use client";

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { isRunActive, shouldStreamRun, showRunControls, getVideoUrl, getScreenshotUrl } from '@/lib/api';

import { useState, useEffect } from 'react';

import { DetailedExecutionLog } from '@/features/runDetails/components/DetailedExectionLog';
import { useRun } from '@/features/runDetails/hooks/UseRun';
import { useCancelRun } from '@/features/runDetails/hooks/UseCancelRun';
import { usePauseRun } from '@/features/runDetails/hooks/UsePauseRun';
import { useResumeRun } from '@/features/runDetails/hooks/UseResumeRun';
import { useRunStream } from '@/features/runDetails/hooks/UseRunStream';
import { RunMeta } from '@/features/runDetails/components/RunMeta';
import { RunHeader } from '@/features/runDetails/components/RunHeder';
import { LiveExecutionLog } from '@/features/runDetails/components/LiveExecutionLog';

export default function RunDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [openSteps, setOpenSteps] = useState<Set<number>>(new Set());
  const [streamingFinished, setStreamingFinished] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const { data: run, isLoading, error: fetchError, refetch } = useRun(id);

  const isActive = run ? isRunActive(run) : false;
  const streamEnabled = run ? shouldStreamRun(run) : false;

  const { steps: liveSteps, liveStatus, streamError, isStreaming } = useRunStream(id, streamEnabled);

  const cancelMutation = useCancelRun(id);
  const pauseMutation = usePauseRun(id);
  const resumeMutation = useResumeRun(id);

  const showControls = run ? showRunControls(run) : false;
  const liveMode = streamEnabled || isStreaming || (run?.paused ?? false);
  const steps =
    liveSteps.length > 0 ? liveSteps : (run?.steps ?? []);
  const error = streamError || (fetchError instanceof Error ? fetchError.message : '');

  useEffect(() => {
    if (isStreaming) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStreamingFinished(true);
      return;
    }

    if (streamingFinished && !isStreaming) {
      refetch();
      setStreamingFinished(false);
    }
  }, [isStreaming, streamingFinished, refetch]);

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

  const handlePause = (reason?: string) => {
    if (!run || pauseMutation.isPending) return;
    pauseMutation.mutate(reason ?? 'Paused by user');
  };

  const handleResume = () => {
    if (!run || resumeMutation.isPending) return;
    resumeMutation.mutate();
  };

  const firstScreenshot = run?.steps && run.steps.length > 0 ? run.steps[0].screenshot : null;
  const posterUrl = firstScreenshot ? getScreenshotUrl(id, firstScreenshot) ?? undefined : undefined;

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
        showControls={showControls}
        canceling={cancelMutation.isPending}
        onBack={() => router.replace('/dashboard')}
        onCancel={handleCancel}
        onPause={() => handlePause()}
        onResume={() => handleResume()}
        pausing={pauseMutation.isPending}
        resuming={resumeMutation.isPending}
      />

      {run && (
        <RunMeta
          run={run}
          runId={id}
          liveMode={liveMode}
          onToggleVideo={() => setShowVideo((s) => !s)}
        />
      )}

      {showVideo && !liveMode && run && (
        <div className="video-card" style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-icons-round">videocam</span>
              <strong>Recording</strong>
            </div>
            <div>
              <a href={getVideoUrl(id)} target="_blank" rel="noreferrer" className="meta-tag" style={{ padding: '0.25rem 0.5rem' }}>
                <span className="material-icons-round">open_in_new</span>
              </a>
              <button type="button" onClick={() => setShowVideo(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginLeft: 8 }} aria-label="Close video">
                <span className="material-icons-round">close</span>
              </button>
            </div>
          </div>
          <div>
            <video
              controls
              style={{ width: '100%', borderRadius: 6, background: '#000', maxHeight: 360 }}
              src={getVideoUrl(id)}
              poster={posterUrl}
            />
          </div>
        </div>
      )}

      {run?.paused && (
        <div className="Tester-block" style={{ marginTop: '1rem' }}>
          <div className="Tester-label">
            <span className="material-icons-round">pause_circle</span> Paused — Checkpoint Saved
          </div>
          <div style={{ padding: '1rem', background: '#fff', borderRadius: 8 }}>
            {run.pause_checkpoint ? (
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                {JSON.stringify(run.pause_checkpoint, null, 2)}
              </pre>
            ) : (
              <p>No checkpoint details available.</p>
            )}
          </div>
        </div>
      )}

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