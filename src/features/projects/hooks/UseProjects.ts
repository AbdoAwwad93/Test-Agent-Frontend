import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProjects, createProject, type ProjectRecord } from "@/lib/api";

export function useProjects() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const {
    data: projects = [],
    isLoading,
    isError,
  } = useQuery<ProjectRecord[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const createMutation = useMutation({
    mutationFn: () => createProject(newName, newDesc || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setShowCreate(false);
      setNewName("");
      setNewDesc("");
    },
  });

  const openCreateModal = () => setShowCreate(true);
  const closeCreateModal = () => setShowCreate(false);
  const submitCreate = () => createMutation.mutate();

  return {
    projects,
    isLoading,
    isError,

    showCreate,
    newName,
    newDesc,
    setNewName,
    setNewDesc,
    openCreateModal,
    closeCreateModal,

    submitCreate,
    isCreating: createMutation.isPending,
    createError: createMutation.isError
      ? (createMutation.error as Error).message
      : null,
  };
}