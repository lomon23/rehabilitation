import React from 'react';
import './Button.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  ...props 
}) => {
  return (
    <button className={`krok-btn krok-btn--${variant}`} {...props}>
      {children}
    </button>
  );
};