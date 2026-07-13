import { useState, useEffect, useMemo } from 'react';
import { isRunActive, shouldStreamRun, showRunControls, getScreenshotUrl } from '@/lib/api';
import { useRun } from '@/features/runDetails/hooks/UseRun';
import { useCancelRun } from '@/features/runDetails/hooks/UseCancelRun';
import { usePauseRun } from '@/features/runDetails/hooks/UsePauseRun';
import { useResumeRun } from '@/features/runDetails/hooks/UseResumeRun';
import { useRunStream } from '@/features/runDetails/hooks/UseRunStream';

function useStreamLifecycle(isStreaming: boolean, refetch: () => Promise<unknown>) {
  const [streamingFinished, setStreamingFinished] = useState(false);
  const [streamEnded, setStreamEnded] = useState(false);

  useEffect(() => {
    if (isStreaming) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStreamingFinished(true);
      return;
    }

    if (streamingFinished && !isStreaming) {
      setStreamEnded(true);
      refetch().finally(() => {
        setStreamingFinished(false);
        const timeoutId = setTimeout(() => setStreamEnded(false), 500);
        return () => clearTimeout(timeoutId);
      });
    }
  }, [isStreaming, streamingFinished, refetch]);

  return streamEnded;
}

/** Simple toggle-set helper for expand/collapse UI state (e.g. step details). */
function useToggleSet() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggle = (idx: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return { openItems, toggle };
}

function useGuardedAction<TArgs extends unknown[]>(
  run: unknown,
  isPending: boolean,
  action: (...args: TArgs) => void,
) {
  return (...args: TArgs) => {
    if (!run || isPending) return;
    action(...args);
  };
}

export function useRunDetailPage(id: string) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { openItems: openSteps, toggle: toggleStep } = useToggleSet();

  const { data: run, isLoading, error: fetchError, refetch } = useRun(id);

  const isActive = run ? isRunActive(run) : false;
  const streamEnabled = run ? shouldStreamRun(run) : false;
  const showControls = run ? showRunControls(run) : false;

  const { steps: liveSteps, liveStatus, streamError, isStreaming, inputRequest: streamInputRequest, clearInputRequest } = useRunStream(id, streamEnabled);

  // Use live stream input_request first; fall back to cached run data for page-refresh recovery
  const inputRequest = streamInputRequest ?? (liveStatus === 'waiting_for_input' && run?.input_request ? run.input_request : null);

  const cancelMutation = useCancelRun(id);
  const pauseMutation = usePauseRun(id);
  const resumeMutation = useResumeRun(id);

  const streamEnded = useStreamLifecycle(isStreaming, refetch);

  const liveMode = streamEnabled || isStreaming || (run?.paused ?? false);
  const steps = liveSteps.length > 0 ? liveSteps : (run?.steps ?? []);
  const errorMessage = streamError || (fetchError instanceof Error ? fetchError.message : '');

  const posterUrl = useMemo(() => {
    const firstScreenshot = run?.steps?.[0]?.screenshot ?? null;
    return firstScreenshot ? getScreenshotUrl(id, firstScreenshot) ?? undefined : undefined;
  }, [run, id]);

  const handleCancel = useGuardedAction(run, cancelMutation.isPending, () =>
    cancelMutation.mutate('Stopped by user from dashboard'),
  );
  const handlePause = useGuardedAction(run, pauseMutation.isPending, (reason?: string) =>
    pauseMutation.mutate(reason ?? 'Paused by user'),
  );
  const handleResume = useGuardedAction(run, resumeMutation.isPending, () => resumeMutation.mutate());

  const openVideo = () => setIsVideoOpen(true);
  const closeVideo = () => setIsVideoOpen(false);

  return {
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
    // recording is only meaningful once we have a finished/non-live run,
    // or right after streaming just ended (so the button doesn't flicker away)
    canShowRecording: streamEnded || !liveMode,
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
  };
}