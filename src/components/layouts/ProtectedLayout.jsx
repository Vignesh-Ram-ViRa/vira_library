import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import Header from '../organisms/Header';
import Icon from '../atoms/Icon';
import { LANGUAGE_CONTENT } from '../../constants/language';
import './ProtectedLayout.css';

const ProtectedLayout = ({ children, requireOwner = false }) => {
  const { user, loading, isOwner } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="protected-layout">
        <div className="loading-screen">
          <div className="loading-content">
            <div className="loading-logo">
              <div className="logo-cube">
                <div className="cube-face cube-front">V</div>
                <div className="cube-face cube-back">L</div>
                <div className="cube-face cube-right">I</div>
                <div className="cube-face cube-left">R</div>
                <div className="cube-face cube-top">A</div>
                <div className="cube-face cube-bottom">L</div>
              </div>
            </div>
            <h2>Loading Vira Library...</h2>
            <p>Initializing your knowledge dashboard</p>
            <div className="loading-progress">
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If owner is required but user is not owner, redirect to login
  if (requireOwner && !isOwner) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="protected-layout">
      <Header />
      
      <main className="main-content">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>{LANGUAGE_CONTENT.footer.copyright}</p>
          <div className="footer__social">
            <a 
              href={LANGUAGE_CONTENT.footer.socialLinks.github} 
              target="_blank" 
              rel="noopener noreferrer"
              title="GitHub"
            >
              <Icon name="github" size="medium" />
            </a>
            <a 
              href={LANGUAGE_CONTENT.footer.socialLinks.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              title="LinkedIn"
            >
              <Icon name="person" size="medium" />
            </a>
            <a 
              href={LANGUAGE_CONTENT.footer.socialLinks.twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              title="Twitter"
            >
              <Icon name="twitter" size="medium" />
            </a>
            <a 
              href={LANGUAGE_CONTENT.footer.socialLinks.email} 
              title="Email"
            >
              <Icon name="mail" size="medium" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProtectedLayout; 