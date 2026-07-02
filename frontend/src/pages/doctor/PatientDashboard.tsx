import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../../components/ui/BottomNav';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../api/auth/auth';
import './PatientDashboard.scss';

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState('');
  const [connectError, setConnectError] = useState('');

  useEffect(() => {
    // 1. ПЕРЕВІРКА РОЛІ (Щоб лікар сюди не зайшов)
    const user = authService.getCurrentUser() as any;
    if (user?.role === 'doctor') {
      navigate('/dashboard'); 
      return;
    }

    checkConnection();
  }, [navigate]);

  const checkConnection = async () => {
    try {
      setIsLoading(true);
      const status = await authService.getPatientStatus();
      
      // Якщо вже в кімнаті — одразу кидаємо на сторінку програми
      if (status.is_connected) {
        navigate('/my-program');
      }
    } catch (e) {
      console.error('Помилка перевірки кімнати:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!inviteCode) return;
    try {
      setIsLoading(true);
      setConnectError('');
      
      // Відправляємо код
      await authService.connectToDoctor(inviteCode);
      
      // Успіх — кидаємо на сторінку програми
      navigate('/my-program'); 
      
    } catch (err: any) {
      setConnectError('Невірний код. Спробуйте ще раз.');
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="patient-dash-container">Завантаження...</div>;

  return (
    <div className="patient-dash-container">
      <div className="dash-scroll-area connect-wrapper">
        <div className="connect-content">
          <h1 className="connect-title">Підключення до лікаря</h1>
          <p className="connect-desc">Введіть унікальний код, який вам надав ваш реабілітолог, щоб отримати план тренувань.</p>
          
          <div className="connect-form">
            <div className="custom-input-wrapper">
              <Input 
                label=""
                placeholder="KROK-XXXX"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              />
            </div>
            
            {connectError && <span className="error-text">{connectError}</span>}
            
            <Button variant="primary" className="connect-btn" onClick={handleConnect} disabled={!inviteCode || isLoading}>
              {isLoading ? 'Підключення...' : 'Підключитися'}
            </Button>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};