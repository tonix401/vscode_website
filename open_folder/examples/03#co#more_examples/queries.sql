-- Create table for users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Insert sample data
INSERT INTO users (username, email) VALUES
  ('alice_wonder', 'alice@example.com'),
  ('bob_builder', 'bob@example.com'),
  ('charlie_code', 'charlie@example.com');

-- Complex query with joins and aggregations
SELECT
  u.id,
  u.username,
  u.email,
  COUNT(p.id) as post_count,
  MAX(p.created_at) as last_post_date
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
WHERE u.created_at > NOW() - INTERVAL '30 days'
GROUP BY u.id, u.username, u.email
HAVING COUNT(p.id) > 0
ORDER BY post_count DESC
LIMIT 10;

-- Update with conditional logic
UPDATE users
SET updated_at = NOW()
WHERE id IN (
  SELECT user_id FROM posts
  WHERE created_at > NOW() - INTERVAL '7 days'
);

-- Transaction example
BEGIN TRANSACTION;
  DELETE FROM posts WHERE user_id = 42;
  DELETE FROM users WHERE id = 42;
COMMIT;
