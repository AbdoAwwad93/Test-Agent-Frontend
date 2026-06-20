/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { API_URL, type RunRecord, type RunStep } from '@/lib/api';
import { mergeStep } from '@/utils/stepMerge';

type LiveStatus = 'connecting' | 'running' | 'cancel_requested' | 'disconnected' | 'error';

interface UseRunStreamResult {
  steps: RunStep[];
  liveStatus: LiveStatus;
  streamError: string;
  isStreaming: boolean;
}
export function useRunStream(id: string, enabled: boolean): UseRunStreamResult {
  const queryClient = useQueryClient();
  const [steps, setSteps] = useState<RunStep[]>([]);
  const [liveStatus, setLiveStatus] = useState<LiveStatus>('connecting');
  const [streamError, setStreamError] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    setIsStreaming(true);
    setLiveStatus('connecting');
    setSteps([]);

    const stream = new EventSource(`${API_URL}/api/runs/${id}/stream`);

    stream.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);

        switch (data.type) {
          case 'step': {
            setSteps((prev) => mergeStep(prev, data));
            setLiveStatus('running');
            queryClient.setQueryData<RunRecord>(['run', id], (old) =>
              old ? { ...old, overall_status: 'running' } : old,
            );
            break;
          }
          case 'cancel_requested': {
            setLiveStatus('cancel_requested');
            queryClient.setQueryData<RunRecord>(['run', id], (old) =>
              old
                ? { ...old, canceled: true, cancel_reason: data.reason ?? old.cancel_reason }
                : old,
            );
            break;
          }
          case 'finished': {
            queryClient.setQueryData<RunRecord>(['run', id], (old) => ({
              ...(old ?? {}),
              ...data,
              overall_status: data.overall_status,
            }));
            setIsStreaming(false);
            stream.close();
            break;
          }
          case 'error': {
            setStreamError(data.message);
            setLiveStatus('error');
            setIsStreaming(false);
            stream.close();
            break;
          }
          case 'done': {
            setIsStreaming(false);
            stream.close();
            break;
          }
          default:
            break;
        }
      } catch (e) {
        console.error(e);
      }
    };

    stream.onerror = () => {
      setLiveStatus('disconnected');
      setIsStreaming(false);
      stream.close();
    };

    return () => {
      stream.close();
    };
  }, [id, enabled, queryClient]);

  return { steps, liveStatus, streamError, isStreaming };
}