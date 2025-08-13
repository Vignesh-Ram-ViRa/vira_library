import React from 'react';
import Icon from '../../atoms/Icon';
import Button from '../../atoms/Button';
import { LANGUAGE_CONTENT } from '../../../constants/language';
import './ToolList.css';

const ToolList = ({ 
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

  const handleVisitWebsite = (e, url) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleToggleFavorite = (e, toolId, isFavorite) => {
    e.stopPropagation();
    onToggleFavorite && onToggleFavorite(toolId, !isFavorite);
  };

  const handleEdit = (e, tool) => {
    e.stopPropagation();
    onEdit && onEdit(tool);
  };

  const handleDelete = (e, tool) => {
    e.stopPropagation();
    onDelete && onDelete(tool);
  };

  const handleRowClick = (tool) => {
    onView && onView(tool);
  };

  const getPricingBadge = (pricing) => {
    const badgeClass = `pricing-badge pricing-badge--${pricing}`;
    return (
      <span className={badgeClass}>
        {content.pricing[pricing] || pricing}
      </span>
    );
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

  if (loading) {
    return (
      <div className="tool-list">
        <div className="tool-list__header">
          <div className="list-header__column list-header__column--tool">Tool</div>
          <div className="list-header__column list-header__column--category">Category</div>
          <div className="list-header__column list-header__column--pricing">Pricing</div>
          <div className="list-header__column list-header__column--rating">Rating</div>
          <div className="list-header__column list-header__column--actions">Actions</div>
        </div>
        <div className="tool-list__content">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="tool-list-item tool-list-item--skeleton">
              <div className="list-item__tool">
                <div className="skeleton skeleton--avatar"></div>
                <div className="skeleton-content">
                  <div className="skeleton skeleton--title"></div>
                  <div className="skeleton skeleton--subtitle"></div>
                </div>
              </div>
              <div className="list-item__category">
                <div className="skeleton skeleton--category"></div>
              </div>
              <div className="list-item__pricing">
                <div className="skeleton skeleton--badge"></div>
              </div>
              <div className="list-item__rating">
                <div className="skeleton skeleton--stars"></div>
              </div>
              <div className="list-item__actions">
                <div className="skeleton skeleton--button"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!tools || tools.length === 0) {
    return (
      <div className="tool-list">
        <div className="tool-list__empty">
          <div className="empty-state">
            <div className="empty-state__icon">
              <Icon name="search" />
            </div>
            <h3 className="empty-state__title">{content.noResults}</h3>
            <p className="empty-state__description">{content.noResultsDescription}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-list">
      <div className="tool-list__header">
        <div className="list-header__column list-header__column--tool">Tool</div>
        <div className="list-header__column list-header__column--category">Category</div>
        <div className="list-header__column list-header__column--pricing">Pricing</div>
        <div className="list-header__column list-header__column--rating">Rating</div>
        <div className="list-header__column list-header__column--actions">Actions</div>
      </div>
      
      <div className="tool-list__content">
        {tools.map((tool) => (
          <div 
            key={tool.id} 
            className="tool-list-item"
            onClick={() => handleRowClick(tool)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleRowClick(tool);
              }
            }}
          >
            <div className="list-item__tool">
              <div className="tool-avatar">
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
                <div className="tool-avatar__placeholder" style={{ display: tool.logo_url ? 'none' : 'flex' }}>
                  <Icon name="puzzle" />
                </div>
              </div>
              <div className="tool-info">
                <div className="tool-name">
                  {tool.name}
                  <button 
                    className={`favorite-btn ${tool.is_favourite ? 'favorite-btn--active' : ''}`}
                    onClick={(e) => handleToggleFavorite(e, tool.id, tool.is_favourite)}
                    aria-label={tool.is_favourite ? content.removeFromFavorites : content.addToFavorites}
                  >
                    <Icon name={tool.is_favourite ? "heartFilled" : "heart"} />
                  </button>
                </div>
                <div className="tool-description">
                  {tool.description.length > 80 
                    ? `${tool.description.substring(0, 80)}...` 
                    : tool.description
                  }
                </div>
                {tool.tags && tool.tags.length > 0 && (
                  <div className="tool-tags">
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
            </div>

            <div className="list-item__category">
              <div className="category-info">
                <Icon name={tool.category_icon || "folder"} />
                <span>{tool.category_display_name || tool.category}</span>
              </div>
            </div>

            <div className="list-item__pricing">
              {getPricingBadge(tool.price_structure)}
            </div>

            <div className="list-item__rating">
              {tool.average_rating > 0 ? (
                <div className="rating-info">
                  <div className="stars">
                    {renderStars(tool.average_rating)}
                  </div>
                  <span className="rating-text">
                    {tool.average_rating.toFixed(1)} ({tool.total_ratings})
                  </span>
                </div>
              ) : (
                <span className="no-rating">No ratings</span>
              )}
            </div>

            <div className="list-item__actions">
              <div className="action-buttons">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={(e) => handleVisitWebsite(e, tool.link)}
                  icon={<Icon name="link" />}
                  className="visit-btn"
                >
                  Visit
                </Button>
                
                {canEdit && (
                  <button
                    className="action-btn action-btn--edit"
                    onClick={(e) => handleEdit(e, tool)}
                    aria-label={content.editTool}
                    title={content.editTool}
                  >
                    <Icon name="edit" />
                  </button>
                )}
                
                {canDelete && (
                  <button
                    className="action-btn action-btn--delete"
                    onClick={(e) => handleDelete(e, tool)}
                    aria-label={content.deleteTool}
                    title={content.deleteTool}
                  >
                    <Icon name="delete" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolList; 