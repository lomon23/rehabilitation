import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './global.scss';

import { AuthLayout } from './layouts/AuthLayout';
import { WelcomePage } from './pages/auth/Welcome'; // Твій лендінг
import { RegisterPage } from './pages/auth/Register';
import { RoleSelectionPage } from './pages/auth/RoleSelection';
import { LoginPage } from './pages/auth/Login';
import { ForgotPasswordPage } from './pages/auth/ForgotPassword';
import { ResetPasswordPage } from './pages/auth/ResetPassword';
import { DataFillingPage } from './pages/auth/DataFilling';

import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { PatientDashboard } from './pages/doctor/PatientDashboard'; // Дашборд пацієнта (графіки і пончик)
import { MainPagePatient } from './pages/doctor/MainPagePatient';    // Список вправ (спільний)
import { ProfilePage } from './pages/profile/Profile';
import { PatientProgramPage } from './pages/doctor/PatientProgramPage';
import {ExercisePlayer} from './pages/camera/ExercisePlayer'
const router = createBrowserRouter([
  {
    element: <AuthLayout />, 
    children: [
      // --- PUBLIC / AUTH FLOW ---
      { path: '/', element: <WelcomePage /> }, // Головна сторінка з логотипом
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/register/role', element: <RoleSelectionPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '/data-filling', element: <DataFillingPage/>},
      
      // --- MAIN APP ---
      { path: '/dashboard', element: <DoctorDashboard /> }, // Дашборд лікаря (список пацієнтів)
      { path: '/patient-dashboard', element: <PatientDashboard /> }, // Дашборд пацієнта (ввід коду KROK-XXX)
      { path: '/dashboard/patient/:id/program', element: <PatientProgramPage /> },
      // Спільна сторінка програми вправ (присідання)
      { path: '/dashboard/patient/:id', element: <MainPagePatient /> }, // Як це бачить лікар
      { path: '/my-program', element: <MainPagePatient /> },            // Як це бачить пацієнт
      
      // --- PROFILE ---
      { path: '/profile', element: <ProfilePage /> },
      { path: '/profile/:id', element: <ProfilePage /> },
      { path: '/exercise/:id', element: <ExercisePlayer /> }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;