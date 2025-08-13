import React from 'react';
import { LANGUAGE_CONTENT } from '../constants/language';
import './Dashboard.css';

const Dashboard = () => {
  const content = LANGUAGE_CONTENT;

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-hero">
          <h1 className="dashboard-title">
            {content.dashboard.heroTitle}
          </h1>
          <p className="dashboard-subtitle">
            {content.dashboard.heroSubtitle}
          </p>
          <p className="dashboard-description">
            {content.dashboard.heroDescription}
          </p>
        </div>
        
        <div className="dashboard-content">
          <div className="dashboard-card">
            <h2>Welcome to Vira Library</h2>
            <p>Your personal knowledge management system is ready to use. Start organizing your resources, notes, and learning materials.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 