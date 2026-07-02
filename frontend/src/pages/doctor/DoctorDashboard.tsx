import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../../components/ui/BottomNav';
import { authService } from '../../api/auth/auth';
import './DoctorDashboard.scss';

export const DoctorDashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('attention');
  const [patients, setPatients] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await authService.getDoctorDashboard(); 
      setPatients(data.patients || []);
      setInvites(data.invites || []);
    } catch (error) {
      console.error('Помилка завантаження дашборду', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRoom = async () => {
    try {
      const newInvite = await authService.generateInvite();
      // Додаємо новий код на початок списку
      setInvites(prev => [newInvite, ...prev]);
    } catch (error) {
      console.error('Помилка створення кімнати', error);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Код ${code} скопійовано!`); 
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-scroll-area">
        
        <div className="dashboard-header">
          <div className="title-row">
            <h1 className="header-title">Мої пацієнти</h1>
            <button className="add-btn" onClick={handleAddRoom}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
          
          <div className="search-bar">
            <input type="text" />
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          <div className="filter-segmented">
            <button 
              className={`filter-btn ${activeFilter === 'attention' ? 'active' : ''}`}
              onClick={() => setActiveFilter('attention')}
            >
              Потребують ревізії
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'stable' ? 'active' : ''}`}
              onClick={() => setActiveFilter('stable')}
            >
              Стабільний прогрес
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'finishing' ? 'active' : ''}`}
              onClick={() => setActiveFilter('finishing')}
            >
              Завершують курс
            </button>
          </div>
        </div>

        <div className="patients-list">
          
          {/* Стан завантаження або порожнього списку */}
          {isLoading && <div className="loading-state">Завантаження...</div>}
          {!isLoading && patients.length === 0 && invites.length === 0 && (
            <div className="empty-state">
              Немає пацієнтів. Натисніть "+" щоб створити кімнату.
            </div>
          )}

          {/* Кімнати очікування (Активні коди) */}
          {invites.map((invite, index) => (
            <div key={`invite-${index}`} className="list-card invite-card">
              <span className="card-text">Очікування пацієнта...</span>
              <span className="card-dot">•</span>
              <span className="card-text code-text" onClick={() => copyToClipboard(invite.code)}>
                {invite.code} (Копіювати)
              </span>
            </div>
          ))}

          {/* Підключені пацієнти */}
          {patients.map(patient => (
            <div 
              key={`patient-${patient.id}`} 
              className="list-card patient-card"
              onClick={() => navigate(`/dashboard/patient/${patient.id}`)}
            >
              <div className="card-content">
                <span className="card-text bold">
                  {patient.name.split('\n').join(' ')}
                </span>
                <span className="card-dot">•</span>
                <span className="card-text">{patient.diagnosis}</span>
                <span className="card-dot">•</span>
                <span className="card-text">День {patient.day}</span>
                <span className="card-dot">•</span>
                <span className="card-progress">{patient.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};