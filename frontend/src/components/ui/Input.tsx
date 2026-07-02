import React from 'react';
import './Input.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode; // Можливість прокинути SVG іконку
}

export const Input: React.FC<InputProps> = ({ label, error, icon, ...props }) => {
  return (
    <div className="krok-input-wrapper">
      <label className="krok-input-label">{label}</label>
      <div className={`krok-input-container ${error ? 'krok-input--error' : ''}`}>
        {icon && <span className="krok-input-icon">{icon}</span>}
        <input className="krok-input-field" {...props} />
      </div>
      {error && <span className="krok-input-error-msg">{error}</span>}
    </div>
  );
};