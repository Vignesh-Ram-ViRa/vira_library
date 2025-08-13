import React from 'react';
import { LANGUAGE_CONTENT } from '../../../constants/language';
import Icon from '../../atoms/Icon';
import './CategoryFilter.css';

const CategoryFilter = ({ 
  categories = [], 
  selectedCategory = 'all', 
  onCategoryChange,
  toolCounts = {} 
}) => {
  const content = LANGUAGE_CONTENT.aiTools;

  // Category icon mapping
  const categoryIcons = {
    all: 'starFull',
    treasure_trove: 'library',
    talkative_tech: 'comment',
    pixel_playhouse: 'deviceCamera',
    media_mayhem: 'play',
    site_sorcery: 'code',
    sidekicks: 'extensions',
    robo_routines: 'robot',
    research_rodeos: 'book',
    random_riffs: 'starFull'
  };

  // Add "All Categories" option
  const allCategories = [
    {
      name: 'all',
      display_name: content.categories.all,
      description: 'All AI tools',
      icon_name: 'starFull'
    },
    ...categories
  ];

  const handleCategoryClick = (categoryName) => {
    onCategoryChange && onCategoryChange(categoryName);
  };

  return (
    <div className="category-filter">
      <div className="category-filter__header">
        <h3 className="filter-title">Categories</h3>
      </div>
      
      <div className="category-filter__tabs">
        {allCategories.map((category) => {
          const isSelected = selectedCategory === category.name;
          const count = toolCounts[category.name] || 0;
          const iconName = category.icon_name || categoryIcons[category.name] || 'folder';
          
          return (
            <button
              key={category.name}
              className={`category-tab ${isSelected ? 'category-tab--active' : ''}`}
              onClick={() => handleCategoryClick(category.name)}
              title={category.description}
            >
              <div className="category-tab__icon">
                <Icon name={iconName} />
              </div>
              
              <div className="category-tab__content">
                <span className="category-tab__name">
                  {category.display_name}
                </span>
                
                {count > 0 && (
                  <span className="category-tab__count">
                    {count}
                  </span>
                )}
              </div>
              
              {isSelected && <div className="category-tab__indicator" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter; 