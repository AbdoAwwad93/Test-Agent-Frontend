"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchRuns, isRunActive, type RunRecord } from '@/lib/api';
import Link from 'next/link';

export default function LiveExecutionStub() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkLive() {
      try {
        const data = await fetchRuns();
        const activeRun = data.find((run: RunRecord) => isRunActive(run));
        if (activeRun) {
          router.replace(`/runs/${activeRun.id}`);
          return;
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    checkLive();
  }, [router]);

  return (
    <div className="page active">
      <header className="page-header">
        <div>
          <h1 className="page-title">Live Execution</h1>
          <p className="page-subtitle" id="live-subtitle">No active run.</p>
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
      
      {!loading && (
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
           <Link href="/runs/new" className="btn btn-primary">Start a New Run</Link>
        </div>
      )}
    </div>
  );
}
