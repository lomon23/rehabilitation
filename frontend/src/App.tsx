import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './global.scss';

import { AuthLayout } from './layouts/AuthLayout';
import { WelcomePage } from './pages/auth/Welcome';
import { RegisterPage } from './pages/auth/Register';
import { RoleSelectionPage } from './pages/auth/RoleSelection';
import { LoginPage } from './pages/auth/Login';
import { ForgotPasswordPage } from './pages/auth/ForgotPassword';
import { ResetPasswordPage } from './pages/auth/ResetPassword';

const router = createBrowserRouter([
  {
  element: <AuthLayout />, 
    children: [
      { path: '/', element: <WelcomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/register/role', element: <RoleSelectionPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      ]
  // --- DASHBOARDS (Цю заглушку поки лишаємо, це інший модуль) ---
  },
  { path: '/dashboard', element: <div>Головна після логіну</div> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;