'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';

import { DetailedExecutionLog } from '@/features/runDetails/components/DetailedExectionLog';
import { RunMeta } from '@/features/runDetails/components/RunMeta';
import { RunHeader } from '@/features/runDetails/components/RunHeader';
import { LiveExecutionLog } from '@/features/runDetails/components/LiveExecutionLog';
import { StoryBlock } from '@/features/runDetails/components/StoryBlock';
import {useRunDetailPage} from "@/features/runDetails/hooks/UseRunDetailPage"
import { InputRequestModal } from '@/features/runDetails/components/InputRequestModal';
import { VideoModal } from '@/features/runDetails/components/VideoModel';
export default function RunDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const {
    run,
    isLoading,
    fetchError,
    errorMessage,
    isActive,
    showControls,
    liveMode,
    liveStatus,
    steps,
    posterUrl,
    isVideoOpen,
    openVideo,
    closeVideo,
    canShowRecording,
    openSteps,
    toggleStep,
    cancelMutation,
    pauseMutation,
    resumeMutation,
    handleCancel,
    handlePause,
    handleResume,
    inputRequest,
    clearInputRequest,
  } = useRunDetailPage(id);

  if (isLoading) {
    return <div className="page active pageLoading">Loading run data...</div>;
  }

  if (fetchError && !run) {
    return (
      <div className="page active pageError">
        <div className="form-error">
          <span className="material-icons-round">error_outline</span>
          <span>{errorMessage}</span>
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

      <StoryBlock story={run?.story} />

      {run && (
        <RunMeta
          run={run}
          runId={id}
          liveMode={liveMode}
          showRecording={canShowRecording}
          onToggleVideo={openVideo}
        />
      )}

     {run?.paused && (
    <div className="Tester-block testerBlock">
      <div className="Tester-label">
        <span className="material-icons-round">pause_circle</span> Paused — Checkpoint Saved
      </div>
    </div>
)}

      {liveMode && (
        <div className="progress-wrap">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min((steps.length / 25) * 100, 100)}%` }}
            />
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

      <div className={liveMode ? 'log-container' : 'execution-log logContainerStatic'}>
        {liveMode ? (
          <LiveExecutionLog steps={steps} targets={run?.targets} />
        ) : (
          <DetailedExecutionLog
            steps={steps}
            runId={id}
            openSteps={openSteps}
            onToggleStep={toggleStep}
            targets={run?.targets}
          />
        )}
      </div>

      {errorMessage && liveMode && (
        <div className="form-error inlineError">
          <span className="material-icons-round">error_outline</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {isVideoOpen && run && (
        <VideoModal runId={id} posterUrl={posterUrl} onClose={closeVideo} />
      )}

      {inputRequest && (
        <InputRequestModal
          runId={id}
          inputRequest={inputRequest}
          onClose={clearInputRequest}
        />
      )}
    </div>
  );
}