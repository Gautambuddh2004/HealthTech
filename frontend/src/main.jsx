import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Category from './pages/Category.jsx';
import Booking from './pages/Booking.jsx';
import Hospital from './pages/Hospital.jsx';
import AdminPanel from './pages/AdminPanel.jsx';

import DoctorPage from './pages/DoctorPage.jsx';
import Notification from "./pages/Notification.jsx";
// import Notification from './pages/Notification.jsx';
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from './pages/ProtectedRoute.jsx';
import HospitalLogin from './pages/HospitalLogin.jsx';      
import HospitalDashboard from './pages/HospitalDashboard.jsx';
import About from './pages/About.jsx'

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
  { path: "/category/:cat", element: <Category /> },
  { path: "/hospital-login", element: <HospitalLogin /> },          
 { path: "/hospitaldashboard", element: <HospitalDashboard /> },
 { path: "/about", element: <About /> },

  // PROTECTED
  { path: "/booking", element: <ProtectedRoute><Booking /></ProtectedRoute> },
  // { path: "/notification", element: <ProtectedRoute><Notification /></ProtectedRoute> },

  // PUBLIC
  { path: "/hospitals", element: <ProtectedRoute><Hospital /></ProtectedRoute> },
  { path: "/doctors", element: <DoctorPage /> },
{ path: "/notification", element: <ProtectedRoute><Notification /></ProtectedRoute> },
  { path: "/admin", element: <ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);