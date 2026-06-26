import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import './ResetPassword.scss';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [passError, setPassError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  // Динамічна перевірка, як на екрані реєстрації
  const isLengthValid = password.length >= 8;
  const isAlphanumericValid = /(?=.*[a-zA-Z])(?=.*\d)/.test(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setPassError('');
    setConfirmError('');
    let hasError = false;

    if (!password) {
      setPassError('Введіть пароль');
      hasError = true;
    } else if (!isLengthValid || !isAlphanumericValid) {
      setPassError('Пароль не відповідає вимогам');
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmError('Підтвердіть пароль');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmError('Паролі не співпадають');
      hasError = true;
    }

    if (hasError) return;

    // Якщо все ок — змінюємо пароль на бекенді і кидаємо на логін
    console.log('Пароль успішно змінено');
    navigate('/login');
  };

  const LockIcon = (
    <svg className="reset-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );

  return (
    <div className="reset-container">
      <div className="reset-content-wrapper">
        <h1 className="reset-title">Змінити пароль</h1>
        
        <form className="reset-form" onSubmit={handleSubmit} noValidate>
          <div className="reset-fields">
            <Input 
              label="Новий пароль" 
              type="password" 
              placeholder="Введіть пароль" 
              icon={LockIcon}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passError}
            />
            
            <div className="reset-password-rules">
              <span className={`rule-item ${isLengthValid ? 'rule-valid' : ''}`}>
                • Мінімум 8 символів
              </span>
              <span className={`rule-item ${isAlphanumericValid ? 'rule-valid' : ''}`}>
                • Має містити букви та цифри
              </span>
            </div>

            <Input 
              label="Підтвердіть пароль" 
              type="password" 
              placeholder="Підтвердіть пароль" 
              icon={LockIcon}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={confirmError}
            />
          </div>
        </form>
      </div>

      <div className="reset-submit-zone">
        <Button onClick={handleSubmit} variant="primary">
          Змінити
        </Button>
      </div>
    </div>
  );
};