import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './global.scss';

import { AuthLayout } from './layouts/AuthLayout';
import { WelcomePage } from './pages/auth/Welcome';
import { RegisterPage } from './pages/auth/Register';
import { RoleSelectionPage } from './pages/auth/RoleSelection';
import { LoginPage } from './pages/auth/Login';
import { ForgotPasswordPage } from './pages/auth/ForgotPassword';
import { ResetPasswordPage } from './pages/auth/ResetPassword';

// Імпортуємо новий дашборд лікаря
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { PatientDetails } from './pages/doctor/PatientDetails';

const router = createBrowserRouter([
  {
    element: <AuthLayout />, 
    children: [
      // --- AUTH FLOW ---
      { path: '/', element: <WelcomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/register/role', element: <RoleSelectionPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      
      // --- MAIN APP ---
      // Поки що тут висить дашборд лікаря. 
      // Пізніше додамо логіку: якщо юзер - пацієнт, рендерити PatientDashboard.
      { path: '/dashboard', element: <DoctorDashboard /> },
      { path: '/dashboard/patient/:id', element: <PatientDetails /> },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;