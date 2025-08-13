import React from 'react';
import ToolCard from '../../atoms/ToolCard';
import { LANGUAGE_CONTENT } from '../../../constants/language';
import './ToolGrid.css';

const ToolGrid = ({ 
  tools = [], 
  loading = false, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  onView,
  canEdit = false,
  canDelete = false 
}) => {
  const content = LANGUAGE_CONTENT.aiTools;

  if (loading) {
    return (
      <div className="tool-grid">
        <div className="tool-grid__loading">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="tool-card-skeleton">
              <div className="skeleton skeleton--badge"></div>
              <div className="skeleton skeleton--heart"></div>
              <div className="skeleton skeleton--logo"></div>
              <div className="skeleton skeleton--title"></div>
              <div className="skeleton skeleton--description"></div>
              <div className="skeleton skeleton--description"></div>
              <div className="skeleton skeleton--category"></div>
              <div className="skeleton skeleton--tags">
                <div className="skeleton skeleton--tag"></div>
                <div className="skeleton skeleton--tag"></div>
                <div className="skeleton skeleton--tag"></div>
              </div>
              <div className="skeleton skeleton--button"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!tools || tools.length === 0) {
    return (
      <div className="tool-grid">
        <div className="tool-grid__empty">
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h3 className="empty-state__title">{content.noResults}</h3>
            <p className="empty-state__description">{content.noResultsDescription}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-grid">
      <div className="tool-grid__container">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
            onView={onView}
            canEdit={canEdit}
            canDelete={canDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ToolGrid; 