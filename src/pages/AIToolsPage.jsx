import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LANGUAGE_CONTENT } from '../constants/language';

// Components
import ToolGrid from '../components/organisms/ToolGrid';
import ToolList from '../components/organisms/ToolList';
import ToolModal from '../components/organisms/ToolModal';
import CategoryFilter from '../components/molecules/CategoryFilter';
import SearchBar from '../components/molecules/SearchBar';
import ViewToggle from '../components/molecules/ViewToggle';
import Button from '../components/atoms/Button';
import Icon from '../components/atoms/Icon';

// API utilities
import {
  getAITools,
  getCategories,
  getToolCounts,
  toggleFavorite,
  rateAITool,
  getUserRating,
  getSearchSuggestions,
  exportAITools
} from '../utils/aiToolsApi';

import './AIToolsPage.css';

const AIToolsPage = () => {
  // State management
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [toolCounts, setToolCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters and view state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSuggestions] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState({ field: 'created_at', order: 'desc' });
  
  // Modal state
  const [selectedTool, setSelectedTool] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(null);
  
  const { isAuthenticated, user } = useAuth();
  const content = LANGUAGE_CONTENT.aiTools;

  // Permission checks
  const isGuest = !isAuthenticated;
  const isDemoUser = user?.email === 'vickyram.vira@gmail.com';
  const isSuperAdmin = user?.app_metadata?.role === 'super_admin';
  const canEdit = !isGuest && (isDemoUser || isSuperAdmin);
  const canDelete = canEdit;

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load tools when filters change
  useEffect(() => {
    loadTools();
  }, [selectedCategory, searchQuery, sortBy]);

  // Load search suggestions
  useEffect(() => {
    if (searchQuery.length > 1) {
      loadSearchSuggestions(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [categoriesData, countsData] = await Promise.all([
        getCategories(),
        getToolCounts()
      ]);
      
      setCategories(categoriesData);
      setToolCounts(countsData);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const loadTools = async () => {
    try {
      setLoading(true);
      const filters = {
        category: selectedCategory,
        search: searchQuery,
        sortBy
      };
      
      const { tools: toolsData } = await getAITools(filters);
      setTools(toolsData);
    } catch (err) {
      console.error('Error loading tools:', err);
      setError('Failed to load AI tools');
    } finally {
      setLoading(false);
    }
  };

  const loadSearchSuggestions = useCallback(async (query) => {
    try {
      const suggestions = await getSearchSuggestions(query);
      setSuggestions(suggestions);
    } catch (err) {
      console.error('Error loading suggestions:', err);
    }
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
  };

  const handleToolView = async (tool) => {
    setSelectedTool(tool);
    setIsModalOpen(true);
    
    // Load user rating for this tool
    if (isAuthenticated) {
      try {
        const rating = await getUserRating(tool.id);
        setUserRating(rating);
      } catch (err) {
        console.error('Error loading user rating:', err);
      }
    }
  };

  const handleToolEdit = (tool) => {
    // TODO: Implement edit functionality
    console.log('Edit tool:', tool);
  };

  const handleToolDelete = (tool) => {
    // TODO: Implement delete functionality
    console.log('Delete tool:', tool);
  };

  const handleToggleFavorite = async (toolId, isFavorite) => {
    try {
      await toggleFavorite(toolId, isFavorite);
      
      // Update tools list
      setTools(prevTools => 
        prevTools.map(tool => 
          tool.id === toolId 
            ? { ...tool, is_favourite: isFavorite }
            : tool
        )
      );
      
      // Update selected tool if it's the one being favorited
      if (selectedTool?.id === toolId) {
        setSelectedTool(prev => ({ ...prev, is_favourite: isFavorite }));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Failed to update favorite status');
    }
  };

  const handleRateTool = async (toolId, rating, review) => {
    try {
      const ratingData = await rateAITool(toolId, rating, review);
      setUserRating(ratingData);
      
      // Reload tools to get updated ratings
      loadTools();
    } catch (err) {
      console.error('Error rating tool:', err);
      setError('Failed to submit rating');
    }
  };

  const handleExport = async () => {
    try {
      const filters = {
        category: selectedCategory,
        search: searchQuery
      };
      
      const csvData = await exportAITools(filters);
      
      // Convert to CSV and download
      const headers = Object.keys(csvData[0]);
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `ai-tools-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting tools:', err);
      setError('Failed to export data');
    }
  };

  const handleAddTool = () => {
    // TODO: Implement add tool functionality
    console.log('Add new tool');
  };

  if (error) {
    return (
      <div className="ai-tools-page">
        <div className="error-state">
          <div className="error-icon">
            <Icon name="warning" />
          </div>
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-tools-page">
      {/* Page Header */}
      <div className="ai-tools-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">{content.title}</h1>
            <p className="page-subtitle">{content.subtitle}</p>
          </div>
          
          <div className="header-actions">
            {canEdit && (
              <Button
                variant="primary"
                onClick={handleAddTool}
                icon={<Icon name="add" />}
                className="add-tool-btn"
              >
                {content.addTool}
              </Button>
            )}
            
            <Button
              variant="secondary"
              onClick={handleExport}
                               icon={<Icon name="export" />}
              className="export-btn"
            >
              {content.exportExcel}
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="ai-tools-filters">
        <div className="filters-row">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
            suggestions={searchSuggestions}
            showSuggestions={true}
            onSuggestionClick={handleSuggestionClick}
          />
          
          <div className="view-controls">
            <ViewToggle
              currentView={viewMode}
              onViewChange={setViewMode}
            />
          </div>
        </div>
        
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          toolCounts={toolCounts}
        />
      </div>

      {/* Results Info */}
      <div className="ai-tools-results-info">
        <div className="results-count">
          {tools.length} {content.resultsFound}
          {selectedCategory !== 'all' && (
            <span className="active-filter">
              in {categories.find(c => c.name === selectedCategory)?.display_name}
            </span>
          )}
          {searchQuery && (
            <span className="active-filter">
              for "{searchQuery}"
            </span>
          )}
        </div>
        
        <div className="sort-controls">
          <label htmlFor="sort-select">{content.sortBy}:</label>
          <select
            id="sort-select"
            value={`${sortBy.field}-${sortBy.order}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy({ field, order });
            }}
            className="sort-select"
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="average_rating-desc">Highest Rated</option>
            <option value="average_rating-asc">Lowest Rated</option>
          </select>
        </div>
      </div>

      {/* Tools Display */}
      <div className="ai-tools-content">
        {viewMode === 'grid' ? (
          <ToolGrid
            tools={tools}
            loading={loading}
            onEdit={handleToolEdit}
            onDelete={handleToolDelete}
            onToggleFavorite={handleToggleFavorite}
            onView={handleToolView}
            canEdit={canEdit}
            canDelete={canDelete}
          />
        ) : (
          <ToolList
            tools={tools}
            loading={loading}
            onEdit={handleToolEdit}
            onDelete={handleToolDelete}
            onToggleFavorite={handleToggleFavorite}
            onView={handleToolView}
            canEdit={canEdit}
            canDelete={canDelete}
          />
        )}
      </div>

      {/* Tool Detail Modal */}
      <ToolModal
        tool={selectedTool}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTool(null);
          setUserRating(null);
        }}
        onEdit={handleToolEdit}
        onDelete={handleToolDelete}
        onToggleFavorite={handleToggleFavorite}
        onRate={handleRateTool}
        canEdit={canEdit}
        canDelete={canDelete}
        userRating={userRating}
      />
    </div>
  );
};

export default AIToolsPage; 