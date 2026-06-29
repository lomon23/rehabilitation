import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { authService } from '../../api/auth/auth';
import './RoleSelection.scss';

type Role = 'patient' | 'doctor' | null;

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedRole) return;

    // Витягуємо дані, які передали з екрану реєстрації
    const state = location.state as any;
    
    // Захист, якщо хтось зайшов на цю сторінку напряму по лінку
    if (!state || !state.email || !state.password) {
      setError('Дані реєстрації втрачено. Поверніться на сторінку реєстрації.');
      setTimeout(() => navigate('/register'), 2000);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Відправляємо POST на /register/
      await authService.register(
        state.email, 
        state.password, 
        state.password_confirm, 
        selectedRole
      );
      
      // 2. Одразу логінимо, щоб отримати access/refresh токени
      const loginData = await authService.login(state.email, state.password);
      
      // 3. Кидаємо на відповідний дашборд
      if (loginData.user.role === 'doctor') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard/patient/1');
      }
    } catch (err: any) {
      setError(err.message || 'Сталася помилка при реєстрації');
    } finally {
      setIsLoading(false);
    }
  };

  const ArrowIcon = (
    <svg className="role-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );

  return (
    <div className="role-container">
      <div className="role-content-wrapper">
        <h1 className="role-title">
          Як ви будете<br />використовувати<br />застосунок?
        </h1>
        
        {/* Блок для помилок з API */}
        {error && <div className="role-error">{error}</div>}
        
        <div className="role-cards-wrapper">
          <div 
            className={`role-card ${selectedRole === 'patient' ? 'role-card--active' : ''}`}
            onClick={() => setSelectedRole('patient')}
          >
            Пацієнт
          </div>
          
          <div 
            className={`role-card ${selectedRole === 'doctor' ? 'role-card--active' : ''}`}
            onClick={() => setSelectedRole('doctor')}
          >
            Лікар/Спеціаліст
          </div>
        </div>
      </div>

      <div className="role-submit-zone">
        <Button 
          onClick={handleSubmit} 
          variant="primary"
          disabled={!selectedRole || isLoading}
        >
          {isLoading ? 'Завантаження...' : 'Далі'}
          <span className="btn-icon-wrapper">{ArrowIcon}</span>
        </Button>
      </div>
    </div>
  );
};