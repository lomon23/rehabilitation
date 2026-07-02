import React from 'react';
import './Button.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  className = '', // Витягуємо className, щоб він не попав у ...props
  children, 
  ...props 
}) => {
  return (
    // Склеюємо класи докупи
    <button className={`krok-btn krok-btn--${variant} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
};