# AI Tools Library - Database Setup

## Prerequisites

1. **Supabase Account**: Make sure you have a Supabase project set up
2. **Environment Variables**: Ensure your `.env` file has the correct Supabase credentials

## Step 1: Environment Variables

Create a `.env` file in the root directory with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 2: Run Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `utilities/database/ai-tools-schema.sql`
4. Run the SQL script

This will create:
- `ai_tool_categories` table with predefined categories
- `ai_tools` table for storing AI tools
- `ai_tool_ratings` table for user ratings
- Row Level Security (RLS) policies
- Sample data including 10 AI tools

## Step 3: Create Demo User (Optional)

If you want to test with the demo user functionality:

1. Create a user account with email: `vickyram.vira@gmail.com`
2. This user will be used for guest access to sample data

## Step 4: Verify Setup

1. Start the development server: `npm run dev`
2. Navigate to the AI Tools page
3. You should see the sample AI tools loaded
4. Test filtering, searching, and view toggling

## Sample Data Included

The setup includes 10 sample AI tools:
- ChatGPT (Talkative Tech - Freemium)
- Midjourney (Pixel Playhouse - Paid)
- GitHub Copilot (Sidekicks - Paid)
- Notion AI (Research Rodeos - Freemium)
- Runway ML (Media Mayhem - Freemium)
- Vercel v0 (Site Sorcery - Free)
- AutoGPT (Robo Routines - Free)
- TensorFlow (Treasure Trove - Free)
- Perplexity AI (Research Rodeos - Freemium)
- Stable Diffusion (Pixel Playhouse - Free)

## Features Available

✅ **Core Functionality**:
- Browse AI tools in grid/list view
- Filter by categories (9 predefined categories)
- Search tools by name, description, tags
- Sort by date, name, rating
- View detailed tool information in modal
- Rate and review tools (when authenticated)
- Toggle favorites
- Export data to CSV

✅ **User Permissions**:
- **Guests**: Can view demo user's tools
- **Authenticated Users**: Can manage their own tools
- **Super Admin**: Can manage all tools

✅ **UI Features**:
- Responsive design (mobile-friendly)
- Glossy texture cards with smooth animations
- Loading states and empty states
- Three theme support (light, dark, pastel)
- Accessibility features

## Troubleshooting

### Common Issues:

1. **No tools showing**: 
   - Check if the database schema was applied correctly
   - Verify environment variables
   - Check browser console for errors

2. **Authentication issues**:
   - Ensure Supabase auth is configured
   - Check RLS policies are enabled

3. **Search not working**:
   - Verify the `ai_tools_with_ratings` view was created
   - Check if full-text search indexes exist

## Next Steps

Once the database is set up, you can:
1. Add your own AI tools
2. Customize categories
3. Implement bulk upload functionality
4. Add more advanced features

The application is now ready to use! 🚀 