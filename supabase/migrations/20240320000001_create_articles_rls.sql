-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert articles
CREATE POLICY "Allow authenticated users to insert articles"
ON articles
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy to allow authenticated users to update their own articles
CREATE POLICY "Allow authenticated users to update articles"
ON articles
FOR UPDATE
TO authenticated
USING (true);

-- Create policy to allow authenticated users to delete their own articles
CREATE POLICY "Allow authenticated users to delete articles"
ON articles
FOR DELETE
TO authenticated
USING (true);

-- Create policy to allow public to read visible articles
CREATE POLICY "Allow public to read visible articles"
ON articles
FOR SELECT
TO public
USING (visible = true); 