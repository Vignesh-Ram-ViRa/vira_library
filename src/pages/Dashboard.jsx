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
            <h2>Welcome to AI Tools Library</h2>
            <p>Discover, explore, and organize the best AI tools across all categories. From chatbots to image generators, find the perfect AI solution for your needs.</p>
            <div className="dashboard-actions">
              <a href="/ai-tools" className="dashboard-btn dashboard-btn--primary">
                Explore AI Tools
              </a>
              <a href="/" className="dashboard-btn dashboard-btn--secondary">
                View All Categories
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 