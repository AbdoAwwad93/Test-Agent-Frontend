"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useActiveRun } from "@/features/runs/hooks/UseActiveRun";

export default function LiveExecutionStub() {
  const router = useRouter();
  const { data: activeRun, isLoading } = useActiveRun();

  useEffect(() => {
    if (activeRun) {
      router.replace(`/runs/${activeRun.id}`);
    }
  }, [activeRun, router]);

  return (
    <div className="page active">
      <header className="page-header">
        <div>
          <h1 className="page-title">Live Execution</h1>
          <p className="page-subtitle" id="live-subtitle">
            No active run.
          </p>
        </div>
        <div className="live-controls">
          <div className="status-pill">
            <span className="dot idle"></span>
            <span>Idle</span>
          </div>
        </div>
      </header>

      <div className="log-container">
        <div className="log-empty">
          <span className="material-icons-round">terminal</span>
          <p>Awaiting sequence initiation…</p>
        </div>
      </div>

      {!isLoading && !activeRun && (
        <div
          style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}
        >
          <Link href="/runs/new" className="btn btn-primary">
            Start a New Run
          </Link>
        </div>
      )}
    </div>
  );
}