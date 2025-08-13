-- Drop existing policies
DROP POLICY IF EXISTS "ai_tools_select_policy" ON ai_tools;
DROP POLICY IF EXISTS "ai_tool_categories_select_policy" ON ai_tool_categories;
DROP POLICY IF EXISTS "ai_tool_ratings_select_policy" ON ai_tool_ratings;

-- Updated select policy for ai_tools
CREATE POLICY "ai_tools_select_policy" ON ai_tools
    FOR SELECT USING (
        -- Allow all users (including unauthenticated) to see demo user tools
        created_by = (SELECT id FROM auth.users WHERE email = 'vickyram.vira@gmail.com' LIMIT 1)
        OR
        -- Authenticated users can see their own tools
        (auth.uid() IS NOT NULL AND (
            -- Super admin can see all
            (auth.jwt() ->> 'role' = 'super_admin') OR
            -- Owners can see their own tools
            (auth.uid() = created_by)
        ))
    );

-- Updated select policy for categories
CREATE POLICY "ai_tool_categories_select_policy" ON ai_tool_categories
    FOR SELECT USING (true); -- Everyone can see categories, no auth needed

-- Updated select policy for ratings
CREATE POLICY "ai_tool_ratings_select_policy" ON ai_tool_ratings
    FOR SELECT USING (true); -- Everyone can see ratings, no auth needed

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Refresh the RLS cache
ALTER TABLE ai_tools DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tool_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tool_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tool_ratings DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tool_ratings ENABLE ROW LEVEL SECURITY; 