import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BottomNav } from '../../components/ui/BottomNav';
import { authService } from '../../api/auth/auth'; // Твій auth.ts
import './PatientProgramPage.scss';

export const PatientProgramPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [patientName, setPatientName] = useState('Завантаження...');
  const [programName, setProgramName] = useState('Програма тренувань');
  const [isEditingMode, setIsEditingMode] = useState(false);
  
  const [exercises, setExercises] = useState<any[]>([]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    const fetchProgram = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await authService.getPatientExercises(id);
        setExercises(data.exercises);
        setPatientName(data.patient_name);
        if (data.program_name) setProgramName(data.program_name);
      } catch (error) {
        console.error('Помилка завантаження програми:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

  const handleAddExercise = async (type: string) => {
    if (!id || isActionLoading) return;

    try {
      setIsActionLoading(true);

      // Формуємо корисне навантаження залежно від того, що нажали
      let payload: any = { name: type, frequency: 'щодня' };

      if (type === 'Присідання') {
        payload = {
          ...payload,
          video_url: 'https://www.youtube.com/watch?v=WrIu5qzWY-U',
          description: 'Поставте ноги на ширині плечей. Опускайте таз назад і вниз, ніби сідаєте на стілець. Спину тримайте рівно, груди розправлені.',
          attention_notes: 'Увага: коліна не повинні виходити за лінію носків і не повинні завалюватись всередину. Вага тіла на п\'ятах.'
        };
      }

      // Відправляємо на бек
      const newExercise = await authService.assignExercise(id, payload);
      
      // Додаємо в локальний стейт, щоб відмалювалось без перезавантаження
      setExercises([...exercises, newExercise]);
      setIsBottomSheetOpen(false);
    } catch (error) {
      console.error('Помилка додавання вправи:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) return <div className="program-page-container loading">Завантаження...</div>;

  return (
    <div className="program-page-container">
      <div className="content-wrapper">
        <div className="scroll-area">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Повернутись
          </button>

          <div className="header-section">
            {isEditingMode ? (
              <input 
                className="title-input" 
                value={programName} 
                onChange={(e) => setProgramName(e.target.value)} 
                onBlur={() => setIsEditingMode(false)} 
                autoFocus
              />
            ) : (
              <h1 className="main-title">{programName}</h1>
            )}
            <h2 className="patient-name">{patientName}</h2>
          </div>

          <div className="controls-row">
            <button className="btn-edit" onClick={() => setIsEditingMode(!isEditingMode)}>Edit</button>
            <button className="btn-add" onClick={() => setIsBottomSheetOpen(true)}>+</button>
          </div>

          <div className="week-selector">
            <span>Тиждень 1</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>

          <div className="exercises-card">
            {exercises.length === 0 ? (
              <div className="empty-state">Список порожній. Натисніть "+" щоб додати вправу.</div>
            ) : (
              <div className="ex-list">
                {exercises.map((ex, index) => (
                  <div key={ex.id || index} className="ex-item">
                    <span className="ex-name">{ex.name}</span>
                    <div className="ex-meta">
                      <span className="ex-freq">{ex.frequency || 'щодня'}</span>
                      <button className="btn-info">i</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className={`bottom-sheet-overlay ${isBottomSheetOpen ? 'open' : ''}`} onClick={() => setIsBottomSheetOpen(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="drag-handle"></div>
            <h3 className="sheet-title">Вправи</h3>
            
            <div className="exercises-grid">
              <button className="ex-tile" onClick={() => handleAddExercise('Присідання')} disabled={isActionLoading}>
                {isActionLoading ? 'Зачекайте...' : 'Присідання'}
              </button>
              
              <button className="ex-tile placeholder">Вправа 2</button>
              <button className="ex-tile placeholder">Вправа 3</button>
              <button className="ex-tile placeholder">Вправа 4</button>
            </div>
          </div>
        </div>

      </div>
      <BottomNav />
    </div>
  );
};