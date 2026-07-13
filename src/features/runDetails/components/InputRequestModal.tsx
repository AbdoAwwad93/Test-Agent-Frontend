'use client';

import { useState, useEffect, FormEvent } from 'react';
import { submitRunInput, type InputRequest } from '@/lib/api';

import "../runDetails.css"

interface InputRequestModalProps {
  runId: string;
  inputRequest: InputRequest;
  onClose: () => void;
  onSubmitted?: () => void;
}

export function InputRequestModal({ runId, inputRequest, onClose, onSubmitted }: InputRequestModalProps) {
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const isPassword = inputRequest.input_type === 'password' || inputRequest.input_type === 'credential';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await submitRunInput(runId, value);
      setValue('');
      onClose();
      onSubmitted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit input');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="video-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Input requested"
    >
      <div className="input-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="video-modal-header">
          <div className="video-modal-title">
            <span className="material-icons-round">psychology</span>
            <strong>Agent Needs Input</strong>
          </div>
          <div className="video-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="video-modal-icon-btn"
              aria-label="Close"
            >
              <span className="material-icons-round">close</span>
            </button>
          </div>
        </div>

        <form className="input-modal-body" onSubmit={handleSubmit}>
          <p className="input-modal-prompt">{inputRequest.prompt}</p>
          {inputRequest.description && (
            <p className="input-modal-desc">{inputRequest.description}</p>
          )}
          <div className="input-modal-field">
            <input
              type={isPassword ? 'password' : 'text'}
              className="form-input input-modal-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={isPassword ? 'Enter value...' : 'Type your answer...'}
              autoFocus
              disabled={submitting}
            />
          </div>
          {error && (
            <div className="form-error">
              <span className="material-icons-round">error_outline</span>
              <span>{error}</span>
            </div>
          )}
          <div className="input-modal-actions">
            <button
              type="submit"
              className="form-submit input-modal-submit"
              disabled={submitting || !value.trim()}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
