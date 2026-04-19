"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

export default function RunDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [run, setRun] = useState<any>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liveMode, setLiveMode] = useState(false);
  const [liveStatus, setLiveStatus] = useState('connecting');
  const [openSteps, setOpenSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7788'}/api/runs/${id}`);
        if (!res.ok) throw new Error('Run not found');
        const data = await res.json();

        setRun(data);
        if (data.steps) {
          setSteps(data.steps);
        }

        if (data.overall_status === 'pending' || data.overall_status === 'running') {
          setLiveMode(true);
          startStreaming();
        } else {
          setLoading(false);
        }
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }

    let stream: EventSource | null = null;
    function startStreaming() {
      stream = new EventSource(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7788'}/api/runs/${id}/stream`);
      setLiveStatus('running');
      setLoading(false);

      stream.onmessage = (ev) => {
        try {
          const eUrlData = JSON.parse(ev.data);
          if (eUrlData.type === 'step') {
            setSteps(prev => [...prev, eUrlData]);
          } else if (eUrlData.type === 'finished') {
            setRun((prev: any) => ({ ...prev, ...eUrlData, overall_status: eUrlData.overall_status }));
            setLiveMode(false);
            if (stream) { stream.close(); stream = null; }
          } else if (eUrlData.type === 'error') {
            setError(eUrlData.message);
            setLiveStatus('error');
            if (stream) { stream.close(); stream = null; }
          } else if (eUrlData.type === 'done') {
            setLiveMode(false);
            if (stream) { stream.close(); stream = null; }
          }
        } catch (e) {
          console.error(e);
        }
      };

      stream.onerror = () => {
        setLiveStatus('disconnected');
        if (stream) { stream.close(); stream = null; }
        setLiveMode(false);
      };
    }

    init();

    return () => {
      if (stream) {
        stream.close();
      }
    };
  }, [id]);

  const toggleStep = (idx: number) => {
    setOpenSteps(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  if (loading) {
    return <div className="page active" style={{ padding: '4rem' }}>Loading run data...</div>;
  }

  if (error && !run) {
    return (
      <div className="page active" style={{ padding: '4rem' }}>
        <div className="form-error">
          <span className="material-icons-round">error_outline</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page active">
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-ghost btn-icon" onClick={() => router.back()}>
            <span className="material-icons-round">arrow_back</span>
          </button>
          <div>
            <h1 className="page-title">{liveMode ? 'Live Execution' : 'Run Details'}</h1>
            <p className="page-subtitle">{run?.story || `Run #${id}`}</p>
          </div>
        </div>
        {!liveMode && run?.overall_status && (
          <div className={`verdict-badge ${run.overall_status}`}>
            {run.overall_status.toUpperCase()}
          </div>
        )}
        {liveMode && (
          <div className="live-controls">
            <div className="status-pill">
              <span className={`dot ${liveStatus === 'running' ? 'running' : 'idle'}`}></span>
              <span>{liveStatus === 'running' ? 'Running' : 'Disconnected'}</span>
            </div>
          </div>
        )}
      </header>

      {run && (
        <div className="run-meta-row" style={{ marginBottom: '2rem' }}>
          <span className="meta-tag"><span className="material-icons-round">link</span>{run.url}</span>
          {!liveMode && (
            <>
              <span className="meta-tag"><span className="material-icons-round">timer</span>{run.total_duration_ms ? (run.total_duration_ms / 1000).toFixed(1) + 's' : '—'}</span>
              <span className="meta-tag"><span className="material-icons-round">checklist</span>{run.passed || 0} passed / {run.failed || 0} failed</span>
            </>
          )}
          <span className="meta-tag"><span className="material-icons-round">tag</span>#{id.substring(0, 8)}</span>
        </div>
      )}

      {liveMode && (
        <div className="progress-wrap">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min((steps.length / 25) * 100, 100)}%` }}></div>
          </div>
          <span className="progress-label">{steps.length} steps recorded</span>
        </div>
      )}

      {!liveMode && run?.summary && (
        <div className="Tester-block">
          <div className="Tester-label"><span className="material-icons-round">psychology</span> Tester Analysis</div>
          <p className="Tester-text">{run.summary}</p>
        </div>
      )}

      <div className="section-header">
        <h2 className="section-title">Execution Log</h2>
        <span className="section-count">{steps.length} steps</span>
      </div>

      <div className={liveMode ? "log-container" : "execution-log"} style={liveMode ? {} : { maxHeight: 'none', background: 'transparent', padding: 0 }}>
        {steps.length === 0 ? (
          <div className="log-empty">
            <span className="material-icons-round">terminal</span>
            <p>Awaiting steps...</p>
          </div>
        ) : (
          steps.map((step, i) => {
            const icon = step.status === 'pass' ? 'check_circle' : step.status === 'fail' ? 'cancel' : liveMode ? 'autorenew' : 'radio_button_unchecked';
            const idxKey = step.step_index ?? step.index ?? i;
            const isOpen = openSteps.has(i);

            if (liveMode) {
              return (
                <div key={idxKey} className="log-entry">
                  <span className={`material-icons-round log-icon ${step.status}`}>{icon}</span>
                  <div className="log-body">
                    <div className="log-action">{step.action}</div>
                    <div className="log-desc">{step.description}</div>
                    {step.error && <div className="log-error">{step.error}</div>}
                  </div>
                  {step.duration_ms !== undefined && <span className="log-dur">{(step.duration_ms / 1000).toFixed(1)}s</span>}
                </div>
              );
            }

            // Detailed view (not live streaming anymore, or fully detailed steps payload)
            const ssrc = step.screenshot
              ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7788'}/screenshot/${id}/${step.screenshot}`
              : null;
            return (
              <div key={idxKey} className={`exec-step ${isOpen ? 'open' : ''}`}>
                <div className="exec-step-header" onClick={() => toggleStep(i)}>
                  <span className="step-num">{String(idxKey + 1).padStart(2, '0')}</span>
                  <span className="step-action-badge">{step.action}</span>
                  <span className="step-desc">{step.description}</span>
                  <span className={`material-icons-round step-status-icon ${step.status}`}>{icon}</span>
                  <span className="step-dur">{step.duration_ms ? (step.duration_ms / 1000).toFixed(1) + 's' : ''}</span>
                </div>
                <div className="exec-step-body" style={{ display: isOpen ? 'flex' : 'none' }}>
                  {step.error && <div className="step-error-box">{step.error}</div>}
                  {step.target && <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>target: {step.target}</div>}
                  {step.value && <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>value: {step.value}</div>}
                  {ssrc && <div className="step-screenshot"><img src={ssrc} alt={`Screenshot step ${idxKey + 1}`} loading="lazy" /></div>}
                </div>
              </div>
            );
          })
        )}
      </div>

      {error && liveMode && (
        <div className="form-error" style={{ marginTop: '1rem' }}>
          <span className="material-icons-round">error_outline</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
