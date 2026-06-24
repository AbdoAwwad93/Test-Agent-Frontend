import { RunRecord } from "@/lib/api";

 export type LiveStatus =
  | 'running'
  | 'connecting'
  | 'paused'
  | 'pause_requested'
  | 'cancel_requested'
  | 'resuming'
  | 'disconnected'
  | string; 

type DotState = 'running' | 'warn' | 'idle';

export function getStatusDotState(liveStatus: LiveStatus): DotState {
  if (liveStatus === 'running' || liveStatus === 'connecting') return 'running';
  if (liveStatus === 'cancel_requested' || liveStatus === 'pause_requested') return 'warn';
  return 'idle';
}

export function getStatusLabel(liveStatus: LiveStatus, run: RunRecord | null): string {
  if (liveStatus === 'running' || liveStatus === 'connecting') return 'Running';
  if (liveStatus === 'pause_requested' || run?.overall_status === 'pause_requested') {
    return 'Pausing...';
  }
  if (liveStatus === 'paused' || run?.paused) return 'Paused';
  if (liveStatus === 'cancel_requested') return 'Cancel Requested';
  if (run?.overall_status === 'resuming') return 'Resuming...';
  return 'Disconnected';
}
