import React from 'react';
import Icon from '../../atoms/Icon';
import './ViewToggle.css';

const ViewToggle = ({ viewMode, onViewChange, className = '' }) => {
  const viewOptions = [
    { mode: 'grid', icon: 'window', label: 'Grid View' },
    { mode: 'list', icon: 'listFlat', label: 'List View' }
  ];

  return (
    <div className={`view-toggle ${className}`}>
      {viewOptions.map(({ mode, icon, label }) => (
        <button
          key={mode}
          type="button"
          className={`view-toggle__option ${viewMode === mode ? 'view-toggle__option--active' : ''}`}
          onClick={() => onViewChange(mode)}
          aria-label={label}
          title={label}
        >
          <Icon name={icon} size="small" />
        </button>
      ))}
    </div>
  );
};

export default ViewToggle; 