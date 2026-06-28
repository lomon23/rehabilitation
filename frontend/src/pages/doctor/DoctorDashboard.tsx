import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../../components/ui/BottomNav';
import './DoctorDashboard.scss';

const MOCK_PATIENTS = [
  { id: 1, name: 'Іван\nІванович', diagnosis: 'Травма коліна', day: '12/30', progress: 34 },
  { id: 2, name: 'Петро\nПетрович', diagnosis: 'Травма спини', day: '5/20', progress: 15 },
  { id: 3, name: 'Анна\nСергіївна', diagnosis: 'Травма коліна', day: '28/30', progress: 95 },
  { id: 4, name: 'Олег\nОлегович', diagnosis: 'Травма плеча', day: '15/30', progress: 50 },
];

export const DoctorDashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Скролл-зона */}
      <div className="dashboard-scroll-area">
        <div className="dashboard-header">
          <span className="header-subtitle">ГОЛОВНА</span>
          
          <div className="title-row">
            <h1 className="header-title">Мої пацієнти</h1>
            {/* Кнопка додавання пацієнта */}
            <button className="add-patient-btn" onClick={() => console.log('Add patient')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
          
          <div className="search-bar">
            <input type="text" placeholder="Пошук..." />
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <div className="filter-chips">
            <button 
              className={`chip ${activeFilter === 'attention' ? 'chip--active' : ''}`}
              onClick={() => setActiveFilter('attention')}
            >
              Потребують уваги
            </button>
            <button 
              className={`chip ${activeFilter === 'stable' ? 'chip--active' : ''}`}
              onClick={() => setActiveFilter('stable')}
            >
              Стабільний прогрес
            </button>
            <button 
              className={`chip ${activeFilter === 'finishing' ? 'chip--active' : ''}`}
              onClick={() => setActiveFilter('finishing')}
            >
              Завершують курс
            </button>
          </div>
        </div>

        <div className="patients-list">
          {MOCK_PATIENTS.map(patient => (
            <div 
              key={patient.id} 
              className="patient-card"
              onClick={() => navigate(`/dashboard/patient/${patient.id}`)}
            >
              <div className="patient-info">
                <h2 className="patient-name">
                  {patient.name.split('\n').map((line, idx) => (
                    <React.Fragment key={idx}>{line}<br/></React.Fragment>
                  ))}
                </h2>
                <span className="patient-details">
                  {patient.diagnosis} • День {patient.day}
                </span>
              </div>
              <div className="patient-progress-block">
                <span className="progress-value">{patient.progress}%</span>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${patient.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Навігація жорстко внизу */}
      <BottomNav />
    </div>
  );
};