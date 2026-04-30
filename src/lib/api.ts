export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:7788";

export type RunStatus =
  | "pass"
  | "fail"
  | "pending"
  | "running"
  | "canceled";

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
};

export type RunRecord = {
  id: string;
  story: string;
  url: string;
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
};

type HealthResponse = {
  status: string;
};

type CreateRunInput = {
  url: string;
  story: string;
  headless: boolean;
};

type CreateRunResponse = {
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
): Promise<CreateRunResponse> {
  const response = await fetch(`${API_URL}/api/runs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJson<CreateRunResponse>(response);
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

export function isRunActive(run?: Pick<RunRecord, "overall_status" | "canceled"> | null) {
  if (!run) {
    return false;
  }

  return (
    !run.canceled &&
    (run.overall_status === "pending" || run.overall_status === "running")
  );
}

export function sortRunsByNewest<T extends Pick<RunRecord, "created_at">>(
  runs: T[],
) {
  return [...runs].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}
