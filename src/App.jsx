import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthLayout from './components/layouts/AuthLayout.jsx';
import ProtectedLayout from './components/layouts/ProtectedLayout.jsx';
import Home from './screens/Home';
import About from './screens/About';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AIToolsPage from './pages/AIToolsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Authentication Route - No Header/Footer */}
          <Route path="/login" element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          } />
          
          {/* Protected Routes - With Header/Footer + Auth Check */}
          <Route path="/" element={
            <ProtectedLayout>
              <AIToolsPage />
            </ProtectedLayout>
          } />
          
          <Route path="/ai-tools" element={
            <ProtectedLayout>
              <AIToolsPage />
            </ProtectedLayout>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          } />
          
          <Route path="/about" element={
            <ProtectedLayout>
              <About />
            </ProtectedLayout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;