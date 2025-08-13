import { supabase } from './supabase';

/**
 * AI Tools API utilities for database operations
 */

// Get all AI tools with filters and search
export const getAITools = async (filters = {}) => {
  try {
    let query = supabase
      .from('ai_tools')
      .select(`
        *,
        ai_tool_categories!inner(display_name, icon_name)
      `);

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    // Apply pricing filter
    if (filters.pricing && filters.pricing !== 'all') {
      query = query.eq('price_structure', filters.pricing);
    }

    // Apply search filter
    if (filters.search) {
      query = query.textSearch('search_vector', filters.search, {
        type: 'websearch',
        config: 'english'
      });
    }

    // Apply favorites filter
    if (filters.favoritesOnly) {
      query = query.eq('is_favourite', true);
    }

    // Apply sorting
    if (filters.sortBy) {
      const { field, order } = filters.sortBy;
      query = query.order(field, { ascending: order === 'asc' });
    } else {
      // Default sort by creation date (newest first)
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    if (filters.page && filters.limit) {
      const from = (filters.page - 1) * filters.limit;
      const to = from + filters.limit - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching AI tools:', error);
      throw error;
    }

    // Process the data to add category info
    const processedTools = (data || []).map(tool => ({
      ...tool,
      category_display_name: tool.ai_tool_categories?.display_name || tool.category,
      category_icon: tool.ai_tool_categories?.icon_name || 'starFull',
      average_rating: 0, // Will be calculated separately if needed
      total_ratings: 0
    }));

    return { tools: processedTools, count };
  } catch (error) {
    console.error('Error in getAITools:', error);
    throw error;
  }
};

// Get a single AI tool by ID
export const getAIToolById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('ai_tools')
      .select(`
        *,
        ai_tool_categories(display_name, icon_name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching AI tool:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getAIToolById:', error);
    throw error;
  }
};

// Create a new AI tool
export const createAITool = async (toolData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to create tools');
    }

    const newTool = {
      ...toolData,
      created_by: user.id,
      updated_by: user.id
    };

    const { data, error } = await supabase
      .from('ai_tools')
      .insert([newTool])
      .select()
      .single();

    if (error) {
      console.error('Error creating AI tool:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createAITool:', error);
    throw error;
  }
};

// Update an existing AI tool
export const updateAITool = async (id, toolData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to update tools');
    }

    const updatedTool = {
      ...toolData,
      updated_by: user.id,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('ai_tools')
      .update(updatedTool)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating AI tool:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateAITool:', error);
    throw error;
  }
};

// Delete an AI tool
export const deleteAITool = async (id) => {
  try {
    const { error } = await supabase
      .from('ai_tools')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting AI tool:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteAITool:', error);
    throw error;
  }
};

// Toggle favorite status
export const toggleFavorite = async (id, isFavorite) => {
  try {
    const { data, error } = await supabase
      .from('ai_tools')
      .update({ is_favourite: isFavorite })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in toggleFavorite:', error);
    throw error;
  }
};

// Rate a tool
export const rateAITool = async (toolId, rating, review = '') => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to rate tools');
    }

    const ratingData = {
      tool_id: toolId,
      user_id: user.id,
      rating,
      review: review.trim()
    };

    // Use upsert to handle both new ratings and updates
    const { data, error } = await supabase
      .from('ai_tool_ratings')
      .upsert(ratingData, { 
        onConflict: 'tool_id,user_id',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (error) {
      console.error('Error rating AI tool:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in rateAITool:', error);
    throw error;
  }
};

// Get user's rating for a tool
export const getUserRating = async (toolId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('ai_tool_ratings')
      .select('*')
      .eq('tool_id', toolId)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching user rating:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserRating:', error);
    return null;
  }
};

// Get all categories with tool counts
export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('ai_tool_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCategories:', error);
    throw error;
  }
};

// Get tool counts by category
export const getToolCounts = async () => {
  try {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('category')
      .eq('created_by', await getCurrentUserOrDemo());

    if (error) {
      console.error('Error fetching tool counts:', error);
      throw error;
    }

    // Count tools by category
    const counts = {};
    let total = 0;
    
    data?.forEach(tool => {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
      total++;
    });
    
    counts.all = total;
    return counts;
  } catch (error) {
    console.error('Error in getToolCounts:', error);
    return {};
  }
};

// Helper function to get current user or demo user ID
const getCurrentUserOrDemo = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    return user.id;
  }
  
  // For guests, get demo user ID
  const { data, error } = await supabase
    .from('auth.users')
    .select('id')
    .eq('email', 'vickyram.vira@gmail.com')
    .single();
    
  if (error || !data) {
    throw new Error('Demo user not found');
  }
  
  return data.id;
};

// Search suggestions
export const getSearchSuggestions = async (query) => {
  try {
    if (!query || query.length < 2) {
      return [];
    }

    const { data, error } = await supabase
      .from('ai_tools')
      .select('name, category, category_display_name')
      .textSearch('search_vector', query, {
        type: 'websearch',
        config: 'english'
      })
      .limit(10);

    if (error) {
      console.error('Error fetching search suggestions:', error);
      return [];
    }

    return data?.map(tool => ({
      name: tool.name,
      category: tool.category_display_name || tool.category
    })) || [];
  } catch (error) {
    console.error('Error in getSearchSuggestions:', error);
    return [];
  }
};

// Export tools to CSV/Excel format
export const exportAITools = async (filters = {}) => {
  try {
    const { tools } = await getAITools(filters);
    
    const csvData = tools.map(tool => ({
      Name: tool.name,
      Description: tool.description,
      Link: tool.link,
      Category: tool.category_display_name || tool.category,
      'Sub Category': tool.sub_category || '',
      'Price Structure': tool.price_structure,
      'Price Details': tool.price_details || '',
      'Average Rating': tool.average_rating || 0,
      'Total Ratings': tool.total_ratings || 0,
      Tags: tool.tags?.join(', ') || '',
      'Is Favourite': tool.is_favourite ? 'Yes' : 'No',
      Comments: tool.comments || '',
      'Created At': new Date(tool.created_at).toLocaleDateString()
    }));

    return csvData;
  } catch (error) {
    console.error('Error in exportAITools:', error);
    throw error;
  }
}; 