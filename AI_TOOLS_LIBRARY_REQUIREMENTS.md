# AI Tools Library - Project Requirements

## Project Overview
Transform the existing Vira Library application into a comprehensive AI Tools Library that catalogs and manages AI tools, services, and applications. The library will serve as a curated collection of AI resources with advanced filtering, searching, and categorization features.

## Inspiration & Reference Sites
- [Futurepedia.io](https://www.futurepedia.io/) - AI tools directory with categories and filters
- [There's An AI For That](https://theresanaiforthat.com/) - AI tools discovery platform

## Database Schema

### Primary Table: `ai_tools`

```sql
CREATE TABLE ai_tools (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
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
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', name || ' ' || description || ' ' || array_to_string(tags, ' '))
    ) STORED
);

-- Indexes for performance
CREATE INDEX ai_tools_category_idx ON ai_tools(category);
CREATE INDEX ai_tools_price_structure_idx ON ai_tools(price_structure);
CREATE INDEX ai_tools_is_favourite_idx ON ai_tools(is_favourite);
CREATE INDEX ai_tools_created_by_idx ON ai_tools(created_by);
CREATE INDEX ai_tools_search_idx ON ai_tools USING GIN(search_vector);
CREATE INDEX ai_tools_tags_idx ON ai_tools USING GIN(tags);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ai_tools_updated_at 
    BEFORE UPDATE ON ai_tools 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### Categories Table (for better management)

```sql
CREATE TABLE ai_tool_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50), -- Icon identifier for UI
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Predefined Categories

1. **Treasure Trove** - AI libraries
2. **Talkative Tech** - Chatbots and LLMs
3. **Pixel Playhouse** - Image editing tools
4. **Media Mayhem** - Video and sound tools
5. **Site Sorcery** - Site builders and vibe coding tools
6. **Sidekicks** - IDE assistants and plugins
7. **Robo Routines** - Agentic AI tools
8. **Research Rodeos** - Research and learning tools
9. **Random Riffs** - Miscellaneous tools

## Sample Data Inserts

```sql
-- Insert categories
INSERT INTO ai_tool_categories (name, display_name, description, icon_name, sort_order) VALUES
('treasure_trove', 'Treasure Trove', 'AI libraries and frameworks', 'library', 1),
('talkative_tech', 'Talkative Tech', 'Chatbots and Large Language Models', 'chat', 2),
('pixel_playhouse', 'Pixel Playhouse', 'Image editing and generation tools', 'image', 3),
('media_mayhem', 'Media Mayhem', 'Video and audio editing tools', 'video', 4),
('site_sorcery', 'Site Sorcery', 'Website builders and coding tools', 'code', 5),
('sidekicks', 'Sidekicks', 'IDE assistants and development plugins', 'puzzle', 6),
('robo_routines', 'Robo Routines', 'Agentic AI and automation tools', 'robot', 7),
('research_rodeos', 'Research Rodeos', 'Research and learning assistance tools', 'book', 8),
('random_riffs', 'Random Riffs', 'Miscellaneous AI tools', 'star', 9);

-- Sample AI tools data
INSERT INTO ai_tools (name, description, link, category, sub_category, price_structure, tags, logo_url) VALUES
('ChatGPT', 'Advanced conversational AI by OpenAI', 'https://chat.openai.com', 'talkative_tech', 'conversational_ai', 'freemium', ARRAY['chatbot', 'conversation', 'openai', 'gpt'], 'https://example.com/chatgpt-logo.png'),
('Midjourney', 'AI-powered image generation tool', 'https://midjourney.com', 'pixel_playhouse', 'image_generation', 'paid', ARRAY['image', 'art', 'generation', 'creative'], 'https://example.com/midjourney-logo.png'),
('GitHub Copilot', 'AI pair programmer for code completion', 'https://github.com/features/copilot', 'sidekicks', 'code_completion', 'paid', ARRAY['coding', 'autocomplete', 'github', 'development'], 'https://example.com/copilot-logo.png');
```

## UI Requirements

### Layout Structure
- **Header**: Navigation with search bar, category filters, and user profile
- **Sidebar/Tabs**: Category filters with counts
- **Main Content**: Grid/List view toggle with tool cards
- **Tool Cards**: Glossy texture design with tool info, pricing badge, favorite button
- **Modals**: Detailed view and edit forms

### Key Features

#### 1. Tool Display
- **Grid View**: Cards with glossy texture (retain existing design preference)
- **List View**: Compact rows with essential information
- **Responsive Design**: Works on all screen sizes

#### 2. Filtering & Search
- **Category Tabs**: Filter by main categories
- **Sub-category Filters**: Nested filtering within categories
- **Price Structure Filter**: Free/Paid/Freemium toggles
- **Smart Search**: Full-text search across name, description, tags
- **Advanced Filters**: Rating, date added, favorites only

#### 3. Tool Management
- **Add Tool Button**: Floating action button or prominent header button
- **Edit Tool**: In-place editing or modal form
- **Delete Tool**: Confirmation dialog
- **Favorite Toggle**: Heart icon with animation

#### 4. Tool Detail View
- **Modal/Overlay**: Detailed information display
- **Screenshots Gallery**: If available
- **External Link**: Direct link to tool website
- **User Actions**: Edit, Delete, Favorite, Share

### UI Components Needed

#### New Components:
- `ToolCard` - Individual tool display card
- `ToolGrid` - Grid layout for tools
- `ToolList` - List layout for tools
- `ToolModal` - Detailed view modal
- `ToolForm` - Add/Edit tool form
- `CategoryFilter` - Category selection tabs
- `AdvancedFilters` - Additional filtering options
- `SearchBar` - Enhanced search with suggestions
- `ViewToggle` - Grid/List view switcher (already exists)

## Requirements Clarifications ✅

### 1. User Management & Permissions
- **Owner Access**: Users can read/write their own entries
- **Super Admin Access**: Can read/write all entries  
- **Guest Access**: Can only read entries from demo user "vickyram.vira@gmail.com"
- **User Roles**: Owner, Super Admin, Guest (similar to vira_verse implementation)

### 2. Tool Submission Process
- **Direct Publication**: Owners can add tools directly without approval
- **No Moderation**: Tools are published immediately upon submission
- **Authentication Required**: Only authenticated users can add tools

### 3. Rating & Reviews System ✅
- **Rating System**: 1-5 star rating system
- **Reviews**: Comments field for user reviews and feedback
- **User Interaction**: Each user can rate and comment on tools

### 4. Data Sources & Integration ✅
- **Manual Curation**: Tools will be manually curated for now
- **Future Automation**: Leave provision for automated data integration
- **External Links**: Link to external tool websites

### 5. Required Features ✅
- **Export to Excel**: Export tools data to Excel format
- **Bulk Upload**: Upload multiple tools via CSV/Excel file
- **List View**: Alternative view for displaying tools data
- **Grid View**: Card-based display with glossy texture design

### 6. Design Requirements ✅
- **Professional**: Clean, modern interface
- **Fun**: Engaging and enjoyable user experience  
- **Creative**: Innovative design elements while maintaining usability

## Technical Implementation Notes

### Database Considerations
- Use Supabase PostgreSQL with Row Level Security (RLS)
- Implement full-text search using PostgreSQL's built-in capabilities
- Use JSONB for flexible metadata storage (screenshots, extended properties)
- Consider using materialized views for performance on large datasets

### Performance Optimizations
- Implement pagination for large tool lists
- Use virtual scrolling for better performance
- Cache frequently accessed data
- Optimize images with lazy loading

### Accessibility
- Ensure all components are keyboard navigable
- Implement proper ARIA labels and roles
- Maintain high contrast ratios for all themes
- Support screen readers

### Security
- Implement proper input validation and sanitization
- Use parameterized queries to prevent SQL injection
- Validate URLs before storing
- Implement rate limiting for search and submissions

## Next Steps

1. **Clarification Phase**: Get answers to the questions above
2. **Database Setup**: Create tables and initial data
3. **Component Development**: Build UI components following the atomic design structure
4. **Integration**: Connect frontend with database
5. **Testing**: Implement comprehensive testing
6. **Deployment**: Set up CI/CD and deployment pipeline

---

**Note**: This document will be updated based on clarifications and feedback before development begins. 