DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS files (
  id serial PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description VARCHAR(1000),
  category VARCHAR NOT NULL,
  language VARCHAR NOT NULL,
  provider VARCHAR NOT NULL,
  roles user_role[] NOT NULL,
  s3key VARCHAR NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Insert seed data
INSERT INTO files (title, description, category, language, provider, roles, s3key)
SELECT * FROM (VALUES
  (
    'SEED - Sample File 1',
    'SEED - This is the first test file.',
    'education',
    'en',
    'internal',
    ARRAY['admin', 'editor']::user_role[],
    'sample1.pdf'
  ),
  (
    'SEED - Sample File 2',
    'SEED - Second test file for testing roles.',
    'media',
    'it',
    'external',
    ARRAY['viewer']::user_role[],
    'sample2.pdf'
  )
) AS seed (title, description, category, language, provider, roles, s3key)
WHERE NOT EXISTS (SELECT 1 FROM files WHERE title = 'Sample File 1');
