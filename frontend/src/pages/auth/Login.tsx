import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import './Login.scss';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Логіка логіну пізніше
    console.log('Login attempt:', { email, password });
    navigate('/dashboard');
  };

  const MailIcon = (
    <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
    </svg>
  );

  const LockIcon = (
    <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );

  return (
    <div className="login-container">
      <h1 className="login-title">Увійти</h1>
      
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-fields">
          <Input 
            label="Email" 
            type="email" 
            placeholder="Введіть пошту" 
            icon={MailIcon}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            label="Пароль" 
            type="password" 
            placeholder="Введіть пароль" 
            icon={LockIcon}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <div className="login-forgot-link">
            <span onClick={() => navigate('/forgot-password')}>Забули пароль?</span>
          </div>
        </div>

        <div className="login-submit-zone">
          <div className="login-redirect">
            Немає акаунта? <span onClick={() => navigate('/register')}>Зареєструватись</span>
          </div>
          <Button type="submit" variant="primary">Увійти</Button>
          
        </div>
      </form>
    </div>
  );
};