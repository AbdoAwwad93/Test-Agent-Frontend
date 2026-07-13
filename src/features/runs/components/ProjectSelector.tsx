"use client";

import { useEffect, useRef, useState } from "react";
import { type ProjectRecord } from "@/lib/api";
import "../runs.css";
interface ProjectSelectorProps {
  projects: ProjectRecord[];
  projectId: string;
  setProjectId: (id: string) => void;
}

export function ProjectSelector({
  projects,
  projectId,
  setProjectId,
}: ProjectSelectorProps) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const options = [{ id: "", name: "-- No project --" }, ...projects];
  const selected =
    options.find((p) => p.id === projectId) ?? options[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      e.preventDefault();
      setOpen(true);
      setHighlight(options.findIndex((p) => p.id === projectId) || 0);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      setProjectId(options[highlight].id);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="form-group">
      <label className="form-label">
        <span className="material-icons-round">folder</span>
        Project (optional)
      </label>
      <p className="form-hint">
        Associate this run with a project to keep related runs organized.
      </p>

      <div className="custom-select" ref={rootRef} onKeyDown={handleKeyDown}>
        <button
          type="button"
          className="custom-select-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => {
            setOpen((o) => !o);
            setHighlight(options.findIndex((p) => p.id === projectId) || 0);
          }}
        >
          <span
            className={
              selected.id === "" ? "custom-select-placeholder" : undefined
            }
          >
            {selected.name}
          </span>
          <span className="material-icons-round custom-select-chevron">
            {open ? "expand_less" : "expand_more"}
          </span>
        </button>

        {open && (
          <ul className="custom-select-menu" role="listbox" tabIndex={-1}>
            {options.map((p, i) => (
              <li
                key={p.id || "none"}
                role="option"
                aria-selected={p.id === projectId}
                className={
                  "custom-select-option" +
                  (p.id === projectId ? " selected" : "") +
                  (i === highlight ? " highlighted" : "")
                }
                onMouseEnter={() => setHighlight(i)}
                onClick={() => {
                  setProjectId(p.id);
                  setOpen(false);
                }}
              >
                <span>{p.name}</span>
                {p.id === projectId && (
                  <span className="material-icons-round custom-select-check">
                    check
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}