export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:7788";

export type RunStatus =
  | "pass"
  | "fail"
  | "pending"
  | "running"
  | "canceled"
  | "pause_requested"
  | "paused"
  | "resuming"
  | "resumed";

export type Target = {
  url: string;
  role?: string | null;
};

export type RunStep = {
  type?: string;
  step_index?: number;
  index?: number;
  action?: string;
  description?: string;
  status?: RunStatus;
  duration_ms?: number;
  error?: string;
  target?: string;
  value?: string;
  screenshot?: string;
  target_index?: number;
};

export type RunRecord = {
  id: string;
  story: string;
  url: string;
  targets?: Target[];
  created_at: string;
  overall_status: RunStatus;
  goal_achieved?: boolean;
  total_duration_ms?: number;
  passed?: number;
  failed?: number;
  summary?: string;
  canceled?: boolean;
  cancel_reason?: string;
  steps?: RunStep[];
  // Pause/resume fields
  paused?: boolean;
  pause_checkpoint?: any | null;
  execution_mode?: "server" | "client_browser" | string;
};

type HealthResponse = {
  status: string;
};

export type CreateRunInput = {
  url?: string;
  targets?: { url: string; role?: string | null }[];
  story: string;
  headless: boolean;
  browser_hint?: string | null;
  execution_mode?: "server" | "client_browser" | string;
};

export type CreateRunResponse = {
  run_id: string;
};

type CancelRunResponse = {
  run_id: string;
  status: string;
};

async function parseJson<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "detail" in data
        ? String(data.detail)
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_URL}/`);
  return parseJson<HealthResponse>(response);
}

export async function fetchRuns(): Promise<RunRecord[]> {
  const response = await fetch(`${API_URL}/api/runs`);
  return parseJson<RunRecord[]>(response);
}

export async function fetchRun(runId: string): Promise<RunRecord> {
  const response = await fetch(`${API_URL}/api/runs/${runId}`);
  return parseJson<RunRecord>(response);
}

export async function createRun(
  payload: CreateRunInput,
  headers?: Record<string, string>,
): Promise<CreateRunResponse> {
  const body: Record<string, unknown> = {
    story: payload.story,
    headless: payload.headless,
  };

  if (payload.targets && payload.targets.length > 0) {
    body.targets = payload.targets;
  } else if (payload.url) {
    body.url = payload.url;
  }

  if (payload.browser_hint) body.browser_hint = payload.browser_hint;
  if (payload.execution_mode) body.execution_mode = payload.execution_mode;

  const response = await fetch(`${API_URL}/api/runs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    body: JSON.stringify(body),
  });

  return parseJson<CreateRunResponse>(response);
}

type PauseRunResponse = {
  run_id: string;
  status: string;
};

export async function pauseRun(runId: string, reason?: string): Promise<PauseRunResponse> {
  const response = await fetch(`${API_URL}/api/runs/${runId}/pause`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });

  return parseJson<PauseRunResponse>(response);
}

type ResumeRunResponse = {
  run_id: string;
  status: string;
};

export async function resumeRun(runId: string): Promise<ResumeRunResponse> {
  const response = await fetch(`${API_URL}/api/runs/${runId}/resume`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  return parseJson<ResumeRunResponse>(response);
}

export async function cancelRun(
  runId: string,
  reason: string,
): Promise<CancelRunResponse> {
  const response = await fetch(`${API_URL}/api/runs/${runId}/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason }),
  });

  return parseJson<CancelRunResponse>(response);
}

export function getScreenshotUrl(runId: string, screenshot?: string | null) {
  if (!screenshot) {
    return null;
  }

  if (/^https?:\/\//i.test(screenshot)) {
    return screenshot;
  }

  return `${API_URL}/screenshot/${runId}/${screenshot}`;
}

/** URL for retrieving the recorded video for a run. */
export function getVideoUrl(runId: string) {
  return `${API_URL}/video/${runId}`;
}

const IN_PROGRESS_STATUSES = new Set<RunStatus>([
  "pending",
  "running",
  "pause_requested",
  "resuming",
  "resumed",
]);

const STREAM_STATUSES = new Set<RunStatus>([
  "pending",
  "running",
  "pause_requested",
  "resuming",
  "resumed",
]);

export function isRunActive(
  run?: Pick<RunRecord, "overall_status" | "canceled" | "paused"> | null,
) {
  if (!run || run.canceled) {
    return false;
  }

  if (run.paused && run.overall_status !== "resuming") {
    return false;
  }

  return IN_PROGRESS_STATUSES.has(run.overall_status);
}

/** Keep SSE open through pause/resume transitions until the run is fully paused or finished. */
export function shouldStreamRun(
  run?: Pick<RunRecord, "overall_status" | "canceled" | "paused"> | null,
) {
  if (!run || run.canceled) {
    return false;
  }

  if (run.paused && run.overall_status !== "resuming") {
    return false;
  }

  return STREAM_STATUSES.has(run.overall_status);
}

export function showRunControls(
  run?: Pick<RunRecord, "overall_status" | "canceled" | "paused"> | null,
): boolean {
  if (!run || run.canceled) {
    return false;
  }

  return isRunActive(run) || Boolean(run.paused);
}

export function hasMultipleTargets(run: RunRecord): boolean {
  return !!(run.targets && run.targets.length > 1);
}

export function getTargetLabel(run: RunRecord): string {
  if (!run.targets || run.targets.length === 0) return run.url;
  if (run.targets.length === 1) return run.targets[0].role || run.url;
  const roles = run.targets.map((t) => t.role || 'default').join(', ');
  return `${run.targets.length} targets: ${roles}`;
}

export function getRoleBadgeColor(role?: string | null): string {
  switch ((role || '').toLowerCase()) {
    case 'admin': return '#ef4444';
    case 'driver': return '#22c55e';
    case 'customer': return '#3b82f6';
    case 'manager': return '#f59e0b';
    case 'viewer': return '#8b5cf6';
    default: return '#6b7280';
  }
}

export function sortRunsByNewest<T extends Pick<RunRecord, "created_at">>(
  runs: T[],
) {
  return [...runs].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}
