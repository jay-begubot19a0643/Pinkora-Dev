-- Supabase SQL Migrations for Pinkora Dev

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  account_status TEXT CHECK (account_status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  CONSTRAINT email_not_empty CHECK (email <> ''),
  CONSTRAINT name_not_empty CHECK (name <> '')
);

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL CHECK (LENGTH(message) >= 10 AND LENGTH(message) <= 5000),
  status TEXT CHECK (status IN ('new', 'read', 'responded')) DEFAULT 'new',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  type TEXT CHECK (type IN ('bug', 'feature', 'improvement', 'other')) DEFAULT 'other',
  message TEXT NOT NULL CHECK (LENGTH(message) >= 10 AND LENGTH(message) <= 5000),
  status TEXT CHECK (status IN ('pending', 'reviewed', 'resolved')) DEFAULT 'pending',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommendations Table
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL CHECK (LENGTH(comment) >= 10 AND LENGTH(comment) <= 1000),
  service_name TEXT NOT NULL CHECK (service_name IN (
    'POS System',
    'Inventory Management',
    'Sales Analytics',
    'Business Dashboard',
    'Video Monitoring',
    'Mobile App',
    'Web Development',
    'System Integration',
    'Cloud Solutions',
    'Other'
  )),
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX idx_recommendations_approved ON recommendations(is_approved);
