
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedLayout from '../components/layouts/ProtectedLayout';
import AuthLayout from '../components/layouts/AuthLayout';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import AIToolsPage from '../pages/AIToolsPage';
import Home from '../screens/Home';
import About from '../screens/About';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <AIToolsPage />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'ai-tools',
        element: <AIToolsPage />
      },
      {
        path: 'about',
        element: <About />
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />
      }
    ]
  }
]);

export default router;
