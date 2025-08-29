-- Enable Row Level Security on the companions table
ALTER TABLE companions ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows only the author to delete their own companions
CREATE POLICY "Users can only delete their own companions"
ON companions
FOR DELETE
USING (auth.uid() = author);

-- Create a policy that allows only the author to update their own companions
CREATE POLICY "Users can only update their own companions"
ON companions
FOR UPDATE
USING (auth.uid() = author)
WITH CHECK (auth.uid() = author);

-- Create a policy that allows only the author to insert companions with their user ID
CREATE POLICY "Users can only insert companions with their user ID"
ON companions
FOR INSERT
WITH CHECK (auth.uid() = author);

-- Create a policy that allows anyone to view companions
CREATE POLICY "Anyone can view companions"
ON companions
FOR SELECT
USING (true);

-- Note: These policies should be executed in the Supabase SQL editor or dashboard
-- The current implementation in companion.actions.ts already includes the author check,
-- but this RLS policy will enforce it at the database level for additional security.