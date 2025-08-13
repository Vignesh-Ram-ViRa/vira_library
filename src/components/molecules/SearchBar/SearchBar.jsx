import React, { useState, useEffect, useRef } from 'react';
import { LANGUAGE_CONTENT } from '../../../constants/language';
import Icon from '../../atoms/Icon';
import Button from '../../atoms/Button';
import './SearchBar.css';

const SearchBar = ({ 
  value = '', 
  onChange, 
  onClear,
  placeholder,
  suggestions = [],
  isLoading = false,
  showSuggestions = false,
  onSuggestionClick
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const content = LANGUAGE_CONTENT.aiTools;

  // Handle input changes with debouncing
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange && onChange(newValue);
    
    // Show suggestions dropdown if there's input and suggestions
    setShowDropdown(newValue.length > 0 && suggestions.length > 0);
  };

  const handleClear = () => {
    onClear && onClear();
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (value.length > 0 && suggestions.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding dropdown to allow clicking on suggestions
    setTimeout(() => setShowDropdown(false), 150);
  };

  const handleSuggestionClick = (suggestion) => {
    onSuggestionClick && onSuggestionClick(suggestion);
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="search-bar">
      <div className={`search-bar__input-wrapper ${isFocused ? 'search-bar__input-wrapper--focused' : ''}`}>
        <div className="search-bar__icon">
          {isLoading ? (
            <div className="search-loading">
              <Icon name="loading" />
            </div>
          ) : (
            <Icon name="search" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          className="search-bar__input"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || content.searchPlaceholder}
        />
        
        {value && (
          <Button
            variant="ghost"
            size="small"
            onClick={handleClear}
            className="search-bar__clear"
            icon={<Icon name="close" />}
            aria-label="Clear search"
          />
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {showDropdown && showSuggestions && suggestions.length > 0 && (
        <div ref={dropdownRef} className="search-suggestions">
          <div className="search-suggestions__header">
            <span className="suggestions-title">Suggestions</span>
          </div>
          
          <div className="search-suggestions__list">
            {suggestions.slice(0, 8).map((suggestion, index) => (
              <button
                key={index}
                className="search-suggestion"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="suggestion-icon">
                  <Icon name="search" />
                </div>
                
                <div className="suggestion-content">
                  <span className="suggestion-text">
                    {suggestion.name || suggestion.text || suggestion}
                  </span>
                  
                  {suggestion.category && (
                    <span className="suggestion-category">
                      in {suggestion.category}
                    </span>
                  )}
                </div>
                
                <div className="suggestion-arrow">
                  <Icon name="arrow-right" />
                </div>
              </button>
            ))}
          </div>
          
          {suggestions.length > 8 && (
            <div className="search-suggestions__footer">
              <span className="more-results">
                +{suggestions.length - 8} more results
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 