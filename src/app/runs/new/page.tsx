"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewRun() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [story, setStory] = useState('');
  const [headless, setHeadless] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!url || !story) {
      setError('Please provide both URL and a User Story.');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, story, headless })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to start run');
      }
      
      router.push(`/runs/${data.run_id}`);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="page active">
      <header className="page-header">
        <div>
          <h1 className="page-title">Design New Narrative</h1>
          <p className="page-subtitle">Establish the parameters and starting point for your automated testing narrative.</p>
        </div>
      </header>

      <div className="form-container">
        <div className="form-card">
          <div className="form-group">
            <label className="form-label" htmlFor="input-url">
              <span className="material-icons-round">link</span>
              Target URL
            </label>
            <p className="form-hint">Provide the initial URL where the agent will begin its journey.</p>
            <input
              type="url"
              id="input-url"
              className="form-input"
              placeholder="https://example.com"
              autoComplete="off"
              spellCheck="false"
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="input-story">
              <span className="material-icons-round">auto_stories</span>
              User Story
            </label>
            <p className="form-hint">Describe the user journey in natural language. The agent will interpret these instructions.</p>
            <textarea
              id="input-story"
              className="form-textarea"
              placeholder="User tries to log in with valid credentials, navigates to the dashboard, and verifies their profile information is displayed correctly..."
              rows={6}
              value={story}
              onChange={e => setStory(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="material-icons-round">tune</span>
              Execution Parameters
            </label>
            <div className="toggle-row">
              <div>
                <span className="toggle-label">Headless Browser</span>
                <span className="toggle-sub">Run without visible browser window</span>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={headless}
                  onChange={e => setHeadless(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="form-quote">
            <span className="material-icons-round">format_quote</span>
            "Ensure narratives are precise. Ambiguity leads to divergent exploration states."
          </div>

          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => router.push('/')}>Cancel</button>
            <button 
              className="btn btn-primary btn-large" 
              onClick={handleSubmit} 
              disabled={loading}
            >
              <span className="material-icons-round">{loading ? 'hourglass_empty' : 'play_arrow'}</span>
              {loading ? 'Initiating...' : 'Initiate Sequence'}
            </button>
          </div>

          {error && (
            <div className="form-error">
              <span className="material-icons-round">error_outline</span>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
