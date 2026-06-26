import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import './RoleSelection.scss';

type Role = 'patient' | 'doctor' | null;

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  const handleSubmit = () => {
    if (!selectedRole) return;
    
    // Тут буде логіка відправки обраної ролі на бекенд (PATCH запит на юзера)
    console.log('Обрана роль:', selectedRole);
    
    // Після успішного збереження кидаємо на головну
    navigate('/dashboard');
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
          disabled={!selectedRole} // Блокуємо кнопку, якщо роль не обрана
        >
          Далі
          <span className="btn-icon-wrapper">{ArrowIcon}</span>
        </Button>
      </div>
    </div>
  );
};