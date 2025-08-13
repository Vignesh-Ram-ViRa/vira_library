import React, { useState } from 'react';
import { LANGUAGE_CONTENT } from '../../../constants/language';
import Icon from '../../atoms/Icon';
import Button from '../../atoms/Button';
import './ToolModal.css';

const ToolModal = ({ 
  tool, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  onRate,
  canEdit = false,
  canDelete = false,
  userRating = null 
}) => {
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(userRating?.rating || 0);
  const [reviewText, setReviewText] = useState(userRating?.review || '');
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  
  const content = LANGUAGE_CONTENT.aiTools;

  if (!isOpen || !tool) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleVisitWebsite = () => {
    window.open(tool.link, '_blank', 'noopener,noreferrer');
  };

  const handleToggleFavorite = () => {
    onToggleFavorite && onToggleFavorite(tool.id, !tool.is_favourite);
  };

  const handleSubmitRating = async () => {
    if (selectedRating > 0) {
      await onRate?.(tool.id, selectedRating, reviewText);
      setShowRatingForm(false);
    }
  };

  const handleEdit = () => {
    onEdit && onEdit(tool);
    onClose();
  };

  const handleDelete = () => {
    onDelete && onDelete(tool);
    onClose();
  };

  const renderStars = (rating, interactive = false) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= rating;
      const isHalfFilled = !isFilled && i - 0.5 === rating;
      
      stars.push(
        <button
          key={i}
          className={`star ${isFilled ? 'star--filled' : isHalfFilled ? 'star--half' : 'star--empty'} ${interactive ? 'star--interactive' : ''}`}
          onClick={interactive ? () => setSelectedRating(i) : undefined}
          disabled={!interactive}
        >
                     <Icon name="starEmpty" />
        </button>
      );
    }
    return stars;
  };

  const getPricingBadgeClass = (pricing) => {
    switch (pricing) {
      case 'free': return 'pricing-badge pricing-badge--free';
      case 'paid': return 'pricing-badge pricing-badge--paid';
      case 'freemium': return 'pricing-badge pricing-badge--freemium';
      default: return 'pricing-badge';
    }
  };

  const screenshots = tool.screenshots || [];

  return (
    <div className="tool-modal-overlay" onClick={handleBackdropClick}>
      <div className="tool-modal">
        {/* Header */}
        <div className="tool-modal__header">
          <div className="modal-header__left">
            <div className="tool-logo">
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
              <div className="tool-logo__placeholder" style={{ display: tool.logo_url ? 'none' : 'flex' }}>
                <Icon name="puzzle" />
              </div>
            </div>
            <div className="tool-header-info">
              <div className="tool-title-row">
                <h2 className="tool-title">{tool.name}</h2>
                <div className={getPricingBadgeClass(tool.price_structure)}>
                  {content.pricing[tool.price_structure] || tool.price_structure}
                </div>
              </div>
              <div className="tool-category">
                <Icon name={tool.category_icon || "folder"} />
                <span>{tool.category_display_name || tool.category}</span>
                {tool.sub_category && <span className="sub-category">/ {tool.sub_category}</span>}
              </div>
            </div>
          </div>
          
          <div className="modal-header__right">
            <button 
              className={`favorite-btn ${tool.is_favourite ? 'favorite-btn--active' : ''}`}
              onClick={handleToggleFavorite}
              aria-label={tool.is_favourite ? content.removeFromFavorites : content.addToFavorites}
            >
                             <Icon name={tool.is_favourite ? "heartFilled" : "heart"} />
            </button>
            <button className="close-btn" onClick={onClose} aria-label="Close">
              <Icon name="close" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="tool-modal__content">
          {/* Description */}
          <div className="modal-section">
            <h3 className="section-title">Description</h3>
            <p className="tool-description">{tool.description}</p>
          </div>

          {/* Screenshots */}
          {screenshots.length > 0 && (
            <div className="modal-section">
              <h3 className="section-title">Screenshots</h3>
              <div className="screenshots-gallery">
                <div className="screenshot-main">
                  <img 
                    src={screenshots[activeScreenshot]} 
                    alt={`${tool.name} screenshot ${activeScreenshot + 1}`}
                  />
                </div>
                {screenshots.length > 1 && (
                  <div className="screenshot-thumbnails">
                    {screenshots.map((screenshot, index) => (
                      <button
                        key={index}
                        className={`screenshot-thumbnail ${index === activeScreenshot ? 'active' : ''}`}
                        onClick={() => setActiveScreenshot(index)}
                      >
                        <img src={screenshot} alt={`Screenshot ${index + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {tool.tags && tool.tags.length > 0 && (
            <div className="modal-section">
              <h3 className="section-title">Tags</h3>
              <div className="tags-list">
                {tool.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Details */}
          {tool.price_details && (
            <div className="modal-section">
              <h3 className="section-title">Pricing Details</h3>
              <p className="price-details">{tool.price_details}</p>
            </div>
          )}

          {/* Rating & Reviews */}
          <div className="modal-section">
            <div className="rating-header">
              <h3 className="section-title">Rating & Reviews</h3>
              <Button
                variant="secondary"
                size="small"
                onClick={() => setShowRatingForm(!showRatingForm)}
                                 icon={<Icon name="starEmpty" />}
              >
                {userRating ? content.rating.update : content.rateTool}
              </Button>
            </div>

            {/* Average Rating */}
            {tool.average_rating > 0 && (
              <div className="average-rating">
                <div className="rating-stars">
                  {renderStars(tool.average_rating)}
                </div>
                <span className="rating-text">
                  {tool.average_rating.toFixed(1)} {content.rating.avgRating} 
                  ({tool.total_ratings} {content.rating.totalReviews})
                </span>
              </div>
            )}

            {/* Rating Form */}
            {showRatingForm && (
              <div className="rating-form">
                <div className="rating-input">
                  <label>Your Rating:</label>
                  <div className="interactive-stars">
                    {renderStars(selectedRating, true)}
                  </div>
                </div>
                <div className="review-input">
                  <label htmlFor="review-text">Review (optional):</label>
                  <textarea
                    id="review-text"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={content.rating.placeholder}
                    rows={3}
                  />
                </div>
                <div className="rating-form-actions">
                  <Button
                    variant="primary"
                    onClick={handleSubmitRating}
                    disabled={selectedRating === 0}
                  >
                    {content.rating.submit}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowRatingForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* User's Current Rating */}
            {userRating && !showRatingForm && (
              <div className="user-rating">
                <h4>Your Rating:</h4>
                <div className="rating-display">
                  <div className="rating-stars">
                    {renderStars(userRating.rating)}
                  </div>
                  <span className="rating-text">{userRating.rating}/5</span>
                </div>
                {userRating.review && (
                  <p className="user-review">"{userRating.review}"</p>
                )}
              </div>
            )}
          </div>

          {/* Comments */}
          {tool.comments && (
            <div className="modal-section">
              <h3 className="section-title">Additional Notes</h3>
              <p className="tool-comments">{tool.comments}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="tool-modal__footer">
          <div className="footer-actions">
            <Button
              variant="primary"
              onClick={handleVisitWebsite}
              icon={<Icon name="link" />}
              className="visit-btn"
            >
              {content.viewWebsite}
            </Button>
            
            {canEdit && (
              <Button
                variant="secondary"
                onClick={handleEdit}
                icon={<Icon name="edit" />}
              >
                {content.editTool}
              </Button>
            )}
            
            {canDelete && (
              <Button
                variant="danger"
                onClick={handleDelete}
                icon={<Icon name="delete" />}
              >
                {content.deleteTool}
              </Button>
            )}
          </div>
          
          <div className="tool-meta">
            <span className="creation-date">
              Added {new Date(tool.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolModal; 