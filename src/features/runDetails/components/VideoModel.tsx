'use client';

import { useEffect } from 'react';
import { getVideoUrl } from '@/lib/api';

import "../runDetails.css"
interface VideoModalProps {
  runId: string;
  posterUrl?: string;
  onClose: () => void;
}

export function VideoModal({ runId, posterUrl, onClose }: VideoModalProps) {
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

  return (
    <div
      className="video-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Run recording"
    >
      <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="video-modal-header">
          <div className="video-modal-title">
            <span className="material-icons-round">videocam</span>
            <strong>Recording</strong>
          </div>
          <div className="video-modal-actions">
            <a
              href={getVideoUrl(runId)}
              target="_blank"
              rel="noreferrer"
              className="video-modal-icon-btn"
              aria-label="Open recording in new tab"
            >
              <span className="material-icons-round">open_in_new</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="video-modal-icon-btn"
              aria-label="Close video"
            >
              <span className="material-icons-round">close</span>
            </button>
          </div>
        </div>

        <div className="video-modal-body">
          <video
            controls
            autoPlay
            className="video-modal-player"
            src={getVideoUrl(runId)}
            poster={posterUrl}
          />
        </div>
      </div>
    </div>
  );
}