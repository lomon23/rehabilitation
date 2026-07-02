import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExerciseDetails } from './ExerciseDetails';
import './CameraSession.scss';

export const CameraSession: React.FC = () => {
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Не вдалося відкрити камеру:', error);
      }
    };

    initCamera();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="camera-session-view">
      <div className="cs-header">
        <button
          className="cs-back-btn"
          onClick={() => navigate(-1)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>

          Завершити
        </button>
      </div>

      <div className="cs-frame">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
        />

        
      </div>

      <div className={`cs-bottom-sheet ${isExpanded ? 'expanded' : ''}`}>
        <div
          className="cs-sheet-header"
          onClick={() => setIsExpanded(prev => !prev)}
        >
          <div className="cs-drag-handle" />
        </div>

        <div
          className="cs-sheet-content"
          onClick={(e) => e.stopPropagation()}
        >
          <ExerciseDetails />
        </div>
      </div>
    </div>
  );
};