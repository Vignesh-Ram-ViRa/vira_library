-- AI Tools Library Database Schema
-- =================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table for better management
CREATE TABLE ai_tool_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50), -- Icon identifier for UI
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Main AI tools table
CREATE TABLE ai_tools (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Core Tool Information
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    link VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100),
    
    -- Pricing Information
    price_structure VARCHAR(20) NOT NULL CHECK (price_structure IN ('free', 'paid', 'freemium')),
    price_details TEXT, -- Additional pricing information
    
    -- User Interaction
    comments TEXT,
    is_favourite BOOLEAN DEFAULT FALSE,
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    
    -- Additional Metadata
    logo_url VARCHAR(500), -- Tool logo/icon
    screenshots JSONB, -- Array of screenshot URLs
    tags TEXT[], -- Array of tags for better search
    website_status VARCHAR(20) DEFAULT 'active' CHECK (website_status IN ('active', 'inactive', 'deprecated')),
    
    -- Authentication & Timestamps
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Search & Discovery  
    search_vector tsvector,
    
    -- Foreign key to categories
    FOREIGN KEY (category) REFERENCES ai_tool_categories(name)
);

-- User ratings table for detailed rating tracking
CREATE TABLE ai_tool_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tool_id UUID NOT NULL REFERENCES ai_tools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tool_id, user_id) -- One rating per user per tool
);

-- Indexes for performance
CREATE INDEX ai_tools_category_idx ON ai_tools(category);
CREATE INDEX ai_tools_price_structure_idx ON ai_tools(price_structure);
CREATE INDEX ai_tools_is_favourite_idx ON ai_tools(is_favourite);
CREATE INDEX ai_tools_created_by_idx ON ai_tools(created_by);
CREATE INDEX ai_tools_search_idx ON ai_tools USING GIN(search_vector);
CREATE INDEX ai_tools_tags_idx ON ai_tools USING GIN(tags);
CREATE INDEX ai_tool_ratings_tool_idx ON ai_tool_ratings(tool_id);
CREATE INDEX ai_tool_ratings_user_idx ON ai_tool_ratings(user_id);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_ai_tools_updated_at 
    BEFORE UPDATE ON ai_tools 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_tool_ratings_updated_at 
    BEFORE UPDATE ON ai_tool_ratings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', 
        NEW.name || ' ' || NEW.description || ' ' || 
        COALESCE(array_to_string(NEW.tags, ' '), '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update search vector
CREATE TRIGGER update_ai_tools_search_vector
    BEFORE INSERT OR UPDATE ON ai_tools
    FOR EACH ROW
    EXECUTE FUNCTION update_search_vector();

-- Insert predefined categories
INSERT INTO ai_tool_categories (name, display_name, description, icon_name, sort_order) VALUES
('treasure_trove', 'Treasure Trove', 'AI libraries and frameworks', 'library', 1),
('talkative_tech', 'Talkative Tech', 'Chatbots and Large Language Models', 'chat', 2),
('pixel_playhouse', 'Pixel Playhouse', 'Image editing and generation tools', 'image', 3),
('media_mayhem', 'Media Mayhem', 'Video and audio editing tools', 'video', 4),
('site_sorcery', 'Site Sorcery', 'Website builders and coding tools', 'code', 5),
('sidekicks', 'Sidekicks', 'IDE assistants and development plugins', 'puzzle', 6),
('robo_routines', 'Robo Routines', 'Agentic AI and automation tools', 'robot', 7),
('research_rodeos', 'Research Rodeos', 'Research and learning assistance tools', 'book', 8),
('random_riffs', 'Random Riffs', 'Miscellaneous AI tools', 'starFull', 9);

-- Sample AI tools data (search_vector will be populated by trigger)
INSERT INTO ai_tools (name, description, link, category, sub_category, price_structure, tags, logo_url, created_by) VALUES
('ChatGPT', 'Advanced conversational AI by OpenAI for natural language conversations, content creation, and problem-solving assistance.', 'https://chat.openai.com', 'talkative_tech', 'conversational_ai', 'freemium', ARRAY['chatbot', 'conversation', 'openai', 'gpt', 'nlp'], 'https://cdn.openai.com/API/logo-openai.svg', (SELECT id FROM auth.users WHERE email = 'vickyram.vira@gmail.com' LIMIT 1)),
('Midjourney', 'AI-powered image generation tool that creates stunning artwork and images from text descriptions using advanced diffusion models.', 'https://midjourney.com', 'pixel_playhouse', 'image_generation', 'paid', ARRAY['image', 'art', 'generation', 'creative', 'diffusion'], 'https://cdn.midjourney.com/logo.png', (SELECT id FROM auth.users WHERE email = 'vickyram.vira@gmail.com' LIMIT 1)),
('GitHub Copilot', 'AI pair programmer that provides intelligent code completion and suggestions directly in your IDE for faster development.', 'https://github.com/features/copilot', 'sidekicks', 'code_completion', 'paid', ARRAY['coding', 'autocomplete', 'github', 'development', 'ai-assistant'], 'https://github.githubassets.com/images/modules/site/copilot/copilot.png', (SELECT id FROM auth.users WHERE email = 'vickyram.vira@gmail.com' LIMIT 1)),
('Notion AI', 'AI-powered workspace that helps with writing, brainstorming, and organizing information within the popular productivity platform.', 'https://notion.so/product/ai', 'research_rodeos', 'productivity', 'freemium', ARRAY['productivity', 'writing', 'organization', 'workspace'], 'https://www.notion.so/images/logo-ios.png', (SELECT id FROM auth.users WHERE email = 'vickyram.vira@gmail.com' LIMIT 1)),
('Runway ML', 'Creative AI platform for video editing, generation, and manipulation with cutting-edge machine learning models.', 'https://runwayml.com', 'media_mayhem', 'video_editing', 'freemium', ARRAY['video', 'editing', 'generation', 'creative', 'ml'], 'https://runwayml.com/favicon.ico', (SELECT id FROM auth.users WHERE email = 'vickyram.vira@gmail.com' LIMIT 1)),
('Vercel v0', 'AI-powered web development tool that generates React components and full web applications from simple text prompts.', 'https://v0.dev', 'site_sorcery', 'web_development', 'free', ARRAY['web-development', 'react', 'components', 'ai-generation'], 'https://v0.dev/favicon.ico', (SELECT id FROM auth.users WHERE email = 'vickyram.vira@gmail.com' LIMIT 1)),
('AutoGPT', 'Autonomous AI agent that can perform complex tasks by breaking them down into smaller steps and executing them independently.', 'https://github.com/Significant-Gravitas/AutoGPT', 'robo_routines', 'autonomous_agents', 'free', ARRAY['automation', 'agents', 'autonomous', 'gpt', 'open-source'], 'https://github.com/Significant-Gravitas/AutoGPT/raw/main/docs/content/assets/AutoGPT_Logo.png', (SELECT id FROM auth.users WHERE email = 'vickyram.vira@gmail.com' LIMIT 1)),
('TensorFlow', 'Open-source machine learning framework for building and deploying ML models at scale across various platforms.', 'https://tensorflow.org', 'treasure_trove', 'ml_framework', 'free', ARRAY['machine-learning', 'framework', 'google', 'open-source', 'python'], 'https://www.tensorflow.org/images/tf_logo_social.png', (SELECT id FROM auth.users WHERE email = 'vickyram.vira@gmail.com' LIMIT 1)),
('Perplexity AI', 'AI-powered search engine that provides accurate answers with citations by combining web search with language models.', 'https://perplexity.ai', 'research_rodeos', 'search_ai', 'freemium', ARRAY['search', 'research', 'citations', 'ai-search'], 'https://www.perplexity.ai/favicon.svg', (SELECT id FROM auth.users WHERE email = 'vickyram.vira@gmail.com' LIMIT 1)),
('Stable Diffusion', 'Open-source text-to-image AI model that generates high-quality images from textual descriptions.', 'https://stability.ai/stable-diffusion', 'pixel_playhouse', 'image_generation', 'free', ARRAY['image-generation', 'open-source', 'text-to-image', 'diffusion'], 'https://stability.ai/favicon.ico', (SELECT id FROM auth.users WHERE email = 'vickyram.vira@gmail.com' LIMIT 1));

-- Add some sample ratings
INSERT INTO ai_tool_ratings (tool_id, user_id, rating, review) VALUES
((SELECT id FROM ai_tools WHERE name = 'ChatGPT'), (SELECT id FROM auth.users WHERE email = 'vickyram.vira@gmail.com' LIMIT 1), 5, 'Excellent conversational AI, very helpful for various tasks.'),
((SELECT id FROM ai_tools WHERE name = 'Midjourney'), (SELECT id FROM auth.users WHERE email = 'vickyram.vira@gmail.com' LIMIT 1), 4, 'Amazing image generation quality, though can be expensive for heavy use.'),
((SELECT id FROM ai_tools WHERE name = 'GitHub Copilot'), (SELECT id FROM auth.users WHERE email = 'vickyram.vira@gmail.com' LIMIT 1), 5, 'Game-changer for coding productivity, saves significant development time.');

-- Row Level Security (RLS) Policies
ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tool_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tool_categories ENABLE ROW LEVEL SECURITY;

-- Policy for ai_tools table
-- Owners can see their own tools, super admin can see all, guests can see demo user tools
CREATE POLICY "ai_tools_select_policy" ON ai_tools
    FOR SELECT USING (
        -- Super admin can see all
        (auth.jwt() ->> 'role' = 'super_admin') OR
        -- Owners can see their own tools
        (auth.uid() = created_by) OR
        -- Guests and everyone can see demo user tools
        (created_by = (SELECT id FROM auth.users WHERE email = 'vickyram.vira@gmail.com' LIMIT 1))
    );

-- Owners can insert their own tools, super admin can insert for anyone
CREATE POLICY "ai_tools_insert_policy" ON ai_tools
    FOR INSERT WITH CHECK (
        -- Must be authenticated
        auth.uid() IS NOT NULL AND (
            -- Super admin can insert for anyone
            (auth.jwt() ->> 'role' = 'super_admin') OR
            -- Owners can insert for themselves
            (auth.uid() = created_by)
        )
    );

-- Owners can update their own tools, super admin can update all
CREATE POLICY "ai_tools_update_policy" ON ai_tools
    FOR UPDATE USING (
        -- Super admin can update all
        (auth.jwt() ->> 'role' = 'super_admin') OR
        -- Owners can update their own tools
        (auth.uid() = created_by)
    );

-- Owners can delete their own tools, super admin can delete all
CREATE POLICY "ai_tools_delete_policy" ON ai_tools
    FOR DELETE USING (
        -- Super admin can delete all
        (auth.jwt() ->> 'role' = 'super_admin') OR
        -- Owners can delete their own tools
        (auth.uid() = created_by)
    );

-- Policy for ai_tool_ratings table
CREATE POLICY "ai_tool_ratings_select_policy" ON ai_tool_ratings
    FOR SELECT USING (
        -- Everyone can see ratings for tools they can see
        EXISTS (
            SELECT 1 FROM ai_tools 
            WHERE ai_tools.id = ai_tool_ratings.tool_id
        )
    );

CREATE POLICY "ai_tool_ratings_insert_policy" ON ai_tool_ratings
    FOR INSERT WITH CHECK (
        -- Users can only rate tools they can see and only for themselves
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM ai_tools 
            WHERE ai_tools.id = ai_tool_ratings.tool_id
        )
    );

CREATE POLICY "ai_tool_ratings_update_policy" ON ai_tool_ratings
    FOR UPDATE USING (
        -- Users can only update their own ratings
        auth.uid() = user_id
    );

CREATE POLICY "ai_tool_ratings_delete_policy" ON ai_tool_ratings
    FOR DELETE USING (
        -- Users can only delete their own ratings
        auth.uid() = user_id
    );

-- Policy for ai_tool_categories table (read-only for most users)
CREATE POLICY "ai_tool_categories_select_policy" ON ai_tool_categories
    FOR SELECT USING (true); -- Everyone can see categories

CREATE POLICY "ai_tool_categories_modify_policy" ON ai_tool_categories
    FOR ALL USING (
        -- Only super admin can modify categories
        auth.jwt() ->> 'role' = 'super_admin'
    );

-- Create views for easier querying
CREATE VIEW ai_tools_with_ratings AS
SELECT 
    t.*,
    COALESCE(AVG(r.rating), 0) as average_rating,
    COUNT(r.rating) as total_ratings,
    c.display_name as category_display_name,
    c.icon_name as category_icon
FROM ai_tools t
LEFT JOIN ai_tool_ratings r ON t.id = r.tool_id
LEFT JOIN ai_tool_categories c ON t.category = c.name
GROUP BY t.id, c.display_name, c.icon_name; 