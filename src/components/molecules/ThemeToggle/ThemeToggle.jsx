import React from 'react';
import { useTheme } from '../../../hooks/useTheme.jsx';
import Icon from '../../atoms/Icon';
import './ThemeToggle.css';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, themeConfig } = useTheme();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return 'lightbulb';
      case 'dark':
        return 'circleFilled';
      case 'pastel':
        return 'symbolColor';
      default:
        return 'lightbulb';
    }
  };

  return (
    <div className={`theme-toggle ${className}`}>
      <button
        className="theme-toggle__button"
        onClick={toggleTheme}
        title={`Switch to next theme (Current: ${themeConfig.name})`}
        aria-label={`Current theme: ${themeConfig.name}. Click to change theme.`}
      >
        <Icon 
          name={getThemeIcon()} 
          size="medium"
          className="theme-toggle__icon"
        />
        <span className="theme-toggle__label">
          {themeConfig.name}
        </span>
      </button>
    </div>
  );
};

export default ThemeToggle; 