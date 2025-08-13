import React, { useState } from 'react';
import { LANGUAGE_CONTENT } from '../../../constants/language';
import Icon from '../Icon';
import Button from '../Button';
import './ToolCard.css';

const ToolCard = ({ 
  tool, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  onView,
  canEdit = false,
  canDelete = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const content = LANGUAGE_CONTENT.aiTools;

  const handleVisitWebsite = (e) => {
    e.stopPropagation();
    window.open(tool.link, '_blank', 'noopener,noreferrer');
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    onToggleFavorite && onToggleFavorite(tool.id, !tool.is_favourite);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit && onEdit(tool);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete && onDelete(tool);
  };

  const handleCardClick = () => {
    onView && onView(tool);
  };

  const getPricingBadgeClass = (pricing) => {
    switch (pricing) {
      case 'free': return 'pricing-badge pricing-badge--free';
      case 'paid': return 'pricing-badge pricing-badge--paid';
      case 'freemium': return 'pricing-badge pricing-badge--freemium';
      default: return 'pricing-badge';
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Icon key={i} name="starFull" className="star star--filled" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Icon key={i} name="starHalf" className="star star--half" />);
      } else {
        stars.push(<Icon key={i} name="starEmpty" className="star star--empty" />);
      }
    }
    return stars;
  };

  return (
    <div 
      className={`tool-card ${isHovered ? 'tool-card--hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Pricing Badge */}
      <div className={getPricingBadgeClass(tool.price_structure)}>
        {content.pricing[tool.price_structure] || tool.price_structure}
      </div>

      {/* Favorite Button */}
      <button 
        className={`favorite-btn ${tool.is_favourite ? 'favorite-btn--active' : ''}`}
        onClick={handleToggleFavorite}
        aria-label={tool.is_favourite ? content.removeFromFavorites : content.addToFavorites}
        title={tool.is_favourite ? content.removeFromFavorites : content.addToFavorites}
      >
        <Icon name={tool.is_favourite ? "heartFilled" : "heart"} />
      </button>

      {/* Tool Logo */}
      <div className="tool-card__logo">
        {tool.logo_url ? (
          <img 
            src={tool.logo_url} 
            alt={`${tool.name} logo`}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="tool-card__logo-placeholder" style={{ display: tool.logo_url ? 'none' : 'flex' }}>
          <Icon name="puzzle" />
        </div>
      </div>

      {/* Tool Content */}
      <div className="tool-card__content">
        <h3 className="tool-card__title">{tool.name}</h3>
        
        <p className="tool-card__description">
          {tool.description.length > 120 
            ? `${tool.description.substring(0, 120)}...` 
            : tool.description
          }
        </p>

        {/* Category */}
        <div className="tool-card__category">
          <Icon name={tool.category_icon || "folder"} />
          <span>{tool.category_display_name || tool.category}</span>
        </div>

        {/* Rating */}
        {tool.average_rating > 0 && (
          <div className="tool-card__rating">
            <div className="stars">
              {renderStars(tool.average_rating)}
            </div>
            <span className="rating-text">
              {tool.average_rating.toFixed(1)} ({tool.total_ratings})
            </span>
          </div>
        )}

        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="tool-card__tags">
            {tool.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
            {tool.tags.length > 3 && (
              <span className="tag tag--more">
                +{tool.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="tool-card__actions">
        <Button
          variant="primary"
          size="small"
          onClick={handleVisitWebsite}
          icon={<Icon name="link" />}
          className="visit-btn"
        >
          {content.viewWebsite}
        </Button>

        <div className="tool-card__admin-actions">
          {canEdit && (
            <button
              className="action-btn action-btn--edit"
              onClick={handleEdit}
              aria-label={content.editTool}
              title={content.editTool}
            >
              <Icon name="edit" />
            </button>
          )}
          
          {canDelete && (
            <button
              className="action-btn action-btn--delete"
              onClick={handleDelete}
              aria-label={content.deleteTool}
              title={content.deleteTool}
            >
              <Icon name="delete" />
            </button>
          )}
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="tool-card__overlay" />
    </div>
  );
};

export default ToolCard; 