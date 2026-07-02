import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BottomNav } from '../../components/ui/BottomNav';
import { Button } from '../../components/ui/Button';
import { authService } from '../../api/auth/auth';
import './MainPagePatient.scss';

export const MainPagePatient: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('patient');
  const [patientName, setPatientName] = useState('друже');
  const [exercises, setExercises] = useState<any[]>([]);

  useEffect(() => {
    const initPage = async () => {
      try {
        setIsLoading(true);
        const user = authService.getCurrentUser() as any;
        if (user?.role) setUserRole(user.role);

        // Якщо це лікар, він має id в URL. Якщо пацієнт - беремо його власний id
        const targetId = id || user.id;

        if (targetId) {
          const data = await authService.getPatientExercises(targetId);
          setExercises(data.exercises);
          if (user.role === 'doctor') {
            setPatientName(data.patient_name);
          } else {
            setPatientName(user.first_name || user.name || 'друже');
          }
        }
      } catch (error) {
        console.error('Помилка ініціалізації:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initPage();
  }, [id]);

  const totalEx = exercises.length;
  const completedEx = exercises.filter(ex => ex.is_completed).length;
  const progressPercent = totalEx === 0 ? 0 : (completedEx / totalEx) * 100;
  const dashOffset = 251.2 - (251.2 * (progressPercent / 100));

  // Знаходимо першу незроблену вправу, щоб дати їй статус 'active'
  const firstPendingIndex = exercises.findIndex(ex => !ex.is_completed);

  if (isLoading) return <div className="main-page-container loading">Завантаження...</div>;

  return (
    <div className="main-page-container">
      <div className="scroll-area">

        {/* =========================================
            ЛІКАР
        ========================================= */}
        {userRole === 'doctor' && (
          <div className="doctor-view flex-column-h">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Повернутись
            </button>

            <div className="hero-section">
              <h1 className="hero-title">{patientName.replace(' ', '\n')}</h1>
              <div className="progress-donut">
                <svg viewBox="0 0 100 100" className="donut-svg">
                  <circle cx="50" cy="50" r="40" className="donut-bg" />
                  <circle cx="50" cy="50" r="40" className="donut-fill" style={{ strokeDashoffset: dashOffset }} />
                </svg>
                <div className="donut-text">{completedEx}/{totalEx}</div>
              </div>
            </div>

            <div className="error-log-section">
              <h2 className="section-title">Лог помилок від MediaPipe</h2>
              <div className="log-list">
                <div className="log-item"><span className="log-name">Коліно за лінією носка:</span><span className="log-count">14 разів</span></div>
                <div className="log-item highlight"><span className="log-name">Завалювання коліна:</span><span className="log-count">3 рази</span></div>
                <div className="log-item"><span className="log-name">Прогин у попереку:</span><span className="log-count">0 разів</span></div>
              </div>
            </div>

            <Button variant="primary" className="btn-view-program" onClick={() => navigate(`/dashboard/patient/${id}/program`)}>
                Переглянути програму
                <svg className="icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </Button>
          </div>
        )}

        {/* =========================================
            ПАЦІЄНТ
        ========================================= */}
        {userRole === 'patient' && (
          <div className="patient-view flex-column-h">
            <div className="hero-section">
              <div className="hero-text">
                <h1 className="hero-title">Привіт, {patientName}!</h1>
                <p className="hero-desc">Твій прогрес<br/>відновлення ножки - <strong>{Math.round(progressPercent)}%</strong></p>
              </div>
              <div className="progress-donut">
                <svg viewBox="0 0 100 100" className="donut-svg">
                  <circle cx="50" cy="50" r="40" className="donut-bg" />
                  <circle cx="50" cy="50" r="40" className="donut-fill" style={{ strokeDashoffset: dashOffset }} />
                </svg>
                <div className="donut-text">{completedEx}/{totalEx}</div>
              </div>
            </div>

            <div className="plan-section">
              <h2 className="section-title">План тренувань на сьогодні:</h2>
              <div className="exercises-card">
                <h3 className="plan-day-title">День 12: Зміцнення суглобів</h3>
                
                {exercises.length === 0 ? (
                  <p style={{color: '#666', fontSize: '14px', textAlign: 'center', marginTop: '16px'}}>Лікар ще не призначив вправи.</p>
                ) : (
                  <div className="ex-list">
                    {exercises.map((ex, index) => {
                      const isCompleted = ex.is_completed;
                      const isActive = index === firstPendingIndex;
                      
                      let exClass = 'pending';
                      if (isCompleted) exClass = 'completed';
                      else if (isActive) exClass = 'active';

                      return (
                        <div key={ex.id} className={`ex-item ${exClass}`}>
                          <div className="ex-info">
                            <span className="ex-num">Вправа {index + 1}</span>
                            <span className="ex-name">{ex.name}</span>
                          </div>
                          
                          {isCompleted && (
                            <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          )}
                          
                          {isActive && (
                            <button className="native-btn-start" onClick={() => navigate(`/exercise/${ex.id}/camera`)}>
                              Старт
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
      <BottomNav />
    </div>
  );
};