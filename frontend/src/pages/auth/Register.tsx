import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import './Register.scss';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const isLengthValid = password.length >= 8;
  const isAlphanumericValid = /(?=.*[a-zA-Z])(?=.*\d)/.test(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setEmailError('');
    setPassError('');
    setConfirmError('');

    let hasError = false;

    if (!email) {
      setEmailError('Введіть пошту');
      hasError = true;
    }

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

    // Секрет тут: API не смикаємо, а передаємо стейт на сторінку вибору ролі
    navigate('/register/role', { 
      state: { 
        email, 
        password, 
        password_confirm: confirmPassword 
      } 
    });
  };

  const MailIcon = (
    <svg className="register-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
    </svg>
  );

  const LockIcon = (
    <svg className="register-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );

  const ArrowIcon = (
    <svg className="register-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );

  return (
    <div className="register-container">
      <h1 className="register-title">Реєстрація</h1>
      
      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <div className="register-fields">
          <Input 
            label="Email" 
            type="email" 
            placeholder="Введіть пошту" 
            icon={MailIcon}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
          />
          
          <Input 
            label="Пароль" 
            type="password" 
            placeholder="Введіть пароль" 
            icon={LockIcon}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passError}
          />

          <Input 
            label="Пароль ще раз" 
            type="password" 
            placeholder="Підтвердіть пароль" 
            icon={LockIcon}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmError}
          />
          
          <div className="register-password-rules">
            <span className={`rule-item ${isLengthValid ? 'rule-valid' : ''}`}>
              • Мінімум 8 символів
            </span>
            <span className={`rule-item ${isAlphanumericValid ? 'rule-valid' : ''}`}>
              • Має містити букви та цифри
            </span>
          </div>
          <div className="register-redirect">
            Вже є акаунт? <span onClick={() => navigate('/login')}>Увійти</span>
          </div>
        </div>

        <div className="register-submit-zone">
          <Button type="submit" variant="primary">
            Зареєструватись
            <span className="btn-icon-wrapper">{ArrowIcon}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};