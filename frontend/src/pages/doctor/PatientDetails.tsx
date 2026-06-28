import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { BottomNav } from '../../components/ui/BottomNav';
import './PatientDetails.scss';

export const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // У майбутньому тут буде fetch(api/patients/${id})
  // Поки що мок-дані під макет
  const patient = {
    name: 'Іван\nІванович',
    completedDays: 12,
    totalDays: 30,
    errors: [
      { name: 'Коліно за лінією носка:', count: '14 разів' },
      { name: 'Завалювання коліна всередину:', count: '3 рази' },
      { name: 'Надмірний прогин у попереку:', count: '0 разів' },
    ]
  };

  return (
    <div className="details-container">
      <div className="details-header">
        <span className="back-btn" onClick={() => navigate(-1)}>
          ← Повернутись
        </span>
      </div>

      <div className="details-top-section">
        <h1 className="patient-name">
          {/* Розбиваємо ім'я на два рядки */}
          {patient.name.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}<br />
            </React.Fragment>
          ))}
        </h1>

        <div className="progress-donut">
          <svg viewBox="0 0 100 100" className="donut-svg">
            {/* Фонове коло */}
            <circle cx="50" cy="50" r="40" className="donut-bg" />
            {/* Заповнене коло (клас .donut-fill-40 відповідає за 40% заповнення) */}
            <circle cx="50" cy="50" r="40" className="donut-fill donut-fill-40" />
          </svg>
          <div className="donut-text">
            {patient.completedDays}/{patient.totalDays}
          </div>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-container">
          <div className="chart-bar-col">
            <span className="day-label">П</span>
            <span className="val-label">52%</span>
            <div className="bar-wrapper"><div className="bar-fill bar-h-52"></div></div>
          </div>
          <div className="chart-bar-col">
            <span className="day-label">В</span>
            <span className="val-label">60%</span>
            <div className="bar-wrapper"><div className="bar-fill bar-h-60"></div></div>
          </div>
          <div className="chart-bar-col">
            <span className="day-label">С</span>
            <span className="val-label">55%</span>
            <div className="bar-wrapper"><div className="bar-fill bar-h-55"></div></div>
          </div>
          <div className="chart-bar-col active-today">
            <span className="day-label">Ч</span>
            <span className="val-label">89%</span>
            <div className="bar-wrapper">
              <div className="bar-fill bar-h-89"></div>
              <div className="target-line"></div>
            </div>
          </div>
          <div className="chart-bar-col">
            <span className="day-label">П</span>
            <span className="val-label">44%</span>
            <div className="bar-wrapper"><div className="bar-fill bar-h-44"></div></div>
          </div>
          <div className="chart-bar-col">
            <span className="day-label">С</span>
            <span className="val-label">72%</span>
            <div className="bar-wrapper"><div className="bar-fill bar-h-72"></div></div>
          </div>
          <div className="chart-bar-col">
            <span className="day-label">Н</span>
            <span className="val-label">34%</span>
            <div className="bar-wrapper"><div className="bar-fill bar-h-34"></div></div>
          </div>
        </div>
      </div>

      <div className="logs-section">
        <h2 className="logs-title">Лог помилок від MediaPipe</h2>
        <div className="logs-table">
          {patient.errors.map((err, idx) => (
            <div key={idx} className={`log-row ${idx % 2 === 0 ? 'row-even' : 'row-odd'}`}>
              <span className="err-name">{err.name}</span>
              <span className="err-count">{err.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="action-section">
        <Button variant="primary" onClick={() => navigate(`/dashboard/patient/${id}/program`)}>
          Переглянути програму
          <svg className="btn-icon-wrapper" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};