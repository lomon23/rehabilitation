import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './global.scss';

import { AuthLayout } from './layouts/AuthLayout';
import { WelcomePage } from './pages/auth/Welcome';
import { RegisterPage } from './pages/auth/Register';
import { RoleSelectionPage } from './pages/auth/RoleSelection';
import { LoginPage } from './pages/auth/Login';
import { ForgotPasswordPage } from './pages/auth/ForgotPassword';
import { ResetPasswordPage } from './pages/auth/ResetPassword';
import { DataFillingPage } from './pages/auth/DataFilling';

import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { PatientDashboard } from './pages/doctor/PatientDashboard'; 
import { MainPagePatient } from './pages/doctor/MainPagePatient';    
import { ProfilePage } from './pages/profile/Profile';
import { PatientProgramPage } from './pages/doctor/PatientProgramPage';
import { ExerciseDetails } from './pages/camera/ExerciseDetails';
import { CameraSession } from './pages/camera/CameraSession';

const router = createBrowserRouter([
  {
    element: <AuthLayout />, 
    children: [
      // --- PUBLIC / AUTH FLOW ---
      { path: '/', element: <WelcomePage /> }, 
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/register/role', element: <RoleSelectionPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '/data-filling', element: <DataFillingPage/>},
      
      // --- MAIN APP ---
      { path: '/dashboard', element: <DoctorDashboard /> }, 
      { path: '/patient-dashboard', element: <PatientDashboard /> }, 
      { path: '/dashboard/patient/:id/program', element: <PatientProgramPage /> },
      { path: '/dashboard/patient/:id', element: <MainPagePatient /> }, 
      { path: '/my-program', element: <MainPagePatient /> },            
      
      // --- PROFILE ---
      { path: '/profile', element: <ProfilePage /> },
      { path: '/profile/:id', element: <ProfilePage /> },
      
      // --- EXERCISE FLOW ---
      { path: '/exercise/:id', element: <ExerciseDetails /> },

      { path: '/exercise/:id/camera', element: <CameraSession /> }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;