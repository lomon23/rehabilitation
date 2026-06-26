import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import './ForgotPassword.scss';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCodeSent) {
      // Тут логіка відправки листа
      console.log('Відправляємо код на:', email);
      setIsCodeSent(true); // Показуємо поле для коду
    } else {
      // Тут логіка перевірки коду
      console.log('Перевіряємо код:', code);
      if (code === '1234') { // Умовна перевірка для MVP
        navigate('/reset-password'); // Перекидаємо на сторінку створення нового пароля
      }
    }
  };

  const MailIcon = (
    <svg className="forgot-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
    </svg>
  );

  const CodeIcon = (
    <svg className="forgot-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );

  return (
    <div className="forgot-container">
      <div className="forgot-header">
        <span className="back-btn" onClick={() => navigate(-1)}>
          ← Повернутись
        </span>
      </div>

      <h1 className="forgot-title">Забули пароль?</h1>
      
      <form className="forgot-form" onSubmit={handleSubmit}>
        <div className="forgot-fields">
          <Input 
            label="Email" 
            type="email" 
            placeholder="Введіть пошту" 
            icon={MailIcon}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isCodeSent} // Блокуємо зміну пошти, коли вже вводимо код
            required 
          />
          
          {/* Це поле з'являється ТІЛЬКИ після відправки пошти */}
          {isCodeSent && (
            <Input 
              label="Код з пошти" 
              type="text" 
              placeholder="0000" 
              icon={CodeIcon}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required 
            />
          )}

          {!isCodeSent && (
            <p className="forgot-hint">
              На вашу електронну пошту буде надіслано лист з кодом підтвердження.
            </p>
          )}
        </div>

        <div className="forgot-submit-zone">
          <Button type="submit" variant="primary">
            {isCodeSent ? 'Підтвердити код' : 'Отримати код'}
          </Button>
        </div>
      </form>
    </div>
  );
};