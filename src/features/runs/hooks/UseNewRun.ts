import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useCreateRun } from "@/features/runs/hooks/UseCreateRun";
import { fetchProjects, type ProjectRecord } from "@/lib/api";

export type TargetEntry = { url: string; role: string };

export function useNewRun() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedProjectId = searchParams.get("project_id") || "";

  const [multiRole, setMultiRole] = useState(false);
  const [url, setUrl] = useState("");
  const [targets, setTargets] = useState<TargetEntry[]>([
    { url: "", role: "" },
  ]);
  const [story, setStory] = useState("");
  const [headless, setHeadless] = useState(true);
  const [projectId, setProjectId] = useState(preselectedProjectId);
  const [urlError, setUrlError] = useState("");
  const [storyError, setStoryError] = useState("");

  const { mutate: submitRun, isPending, error } = useCreateRun();

  const { data: projects = [] } = useQuery<ProjectRecord[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const toggleMultiRole = (checked: boolean) => {
    setMultiRole(checked);
    if (urlError) setUrlError("");
  };

  const updateUrl = (value: string) => {
    setUrl(value);
    if (urlError) setUrlError("");
  };

  const updateStory = (value: string) => {
    setStory(value);
    if (storyError) setStoryError("");
  };

  const addTarget = () => {
    setTargets([...targets, { url: "", role: "" }]);
  };

  const removeTarget = (idx: number) => {
    if (targets.length <= 1) return;
    setTargets(targets.filter((_, i) => i !== idx));
  };

  const updateTarget = (idx: number, field: "url" | "role", value: string) => {
    const next = targets.map((t, i) =>
      i === idx ? { ...t, [field]: value } : t
    );
    setTargets(next);
    if (urlError) setUrlError("");
  };

  const cancel = () => router.push("/dashboard");

  const handleSubmit = () => {
    let nextUrlError = "";
    if (multiRole) {
      const emptyTarget = targets.some((t) => !t.url);
      nextUrlError = emptyTarget ? "All target URLs are required." : "";
    } else {
      nextUrlError = !url ? "Please provide a target URL." : "";
    }
    const nextStoryError = !story ? "Please describe a user story." : "";

    setUrlError(nextUrlError);
    setStoryError(nextStoryError);

    if (nextUrlError || nextStoryError) {
      return;
    }

    const basePayload = multiRole
      ? {
          targets: targets.map((t) => ({
            url: t.url,
            role: t.role || null,
          })),
          story,
          headless,
        }
      : { url, story, headless };

    const payload = {
      ...basePayload,
      ...(projectId ? { project_id: projectId } : {}),
    };

    submitRun(payload, {
      onSuccess: (data) => {
        router.push(`/runs/${data.run_id}`);
      },
    });
  };

  const submitError =
    error instanceof Error
      ? error.message
      : error
      ? "An unknown error occurred"
      : "";

  return {
    projects,
    projectId,
    setProjectId,

    multiRole,
    toggleMultiRole,

    url,
    updateUrl,

    targets,
    addTarget,
    removeTarget,
    updateTarget,

    story,
    updateStory,

    headless,
    setHeadless,

    urlError,
    storyError,

    handleSubmit,
    isPending,
    submitError,
    cancel,
  };
}