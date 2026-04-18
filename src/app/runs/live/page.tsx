"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LiveExecutionStub() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkLive() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7788'}/api/runs`);
        if (res.ok) {
          const data = await res.json();
          const activeRun = data.find((r: any) => r.overall_status === 'pending' || r.overall_status === 'running');
          if (activeRun) {
            router.replace(`/runs/${activeRun.id}`);
            return;
          }
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
