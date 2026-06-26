import React from 'react';
import { Outlet } from 'react-router-dom';
import './AuthLayout.scss';

export const AuthLayout: React.FC = () => {
  return (
    <div className="layout-wrapper">
      <div className="mobile-frame">
        {/* Outlet підтягує сюди ту сторінку, на якій ми зараз знаходимося */}
        <Outlet />
      </div>
    </div>
  );
};