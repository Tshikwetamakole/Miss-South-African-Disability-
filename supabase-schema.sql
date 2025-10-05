-- Miss South Africa Disability Database Schema
-- Run these SQL commands in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/nkehxuiyjgdatkyfvkgq/sql

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('contestant', 'admin', 'judge', 'sponsor', 'visitor');
CREATE TYPE application_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected');
CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');

-- 1. Users/Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  profile_image_url TEXT,
  role user_role DEFAULT 'visitor',
  bio TEXT,
  location TEXT,
  disability_type TEXT,
  accessibility_needs JSONB,
  social_media JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Contestants Table
CREATE TABLE IF NOT EXISTS contestants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  contestant_number INTEGER UNIQUE,
  title TEXT,
  height DECIMAL(5,2),
  measurements JSONB,
  education TEXT,
  occupation TEXT,
  achievements TEXT[],
  platform_statement TEXT,
  why_compete TEXT,
  role_model TEXT,
  future_goals TEXT,
  emergency_contact JSONB,
  medical_information TEXT,
  accommodation_needs TEXT,
  is_active BOOLEAN DEFAULT true,
  year INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status application_status DEFAULT 'draft',
  application_data JSONB NOT NULL,
  documents JSONB, -- URLs to uploaded documents
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES profiles(id),
  reviewer_notes TEXT,
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT, -- 'pageant', 'workshop', 'interview', 'social'
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  venue_details JSONB,
  capacity INTEGER,
  registration_required BOOLEAN DEFAULT false,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  accessibility_features TEXT[],
  dress_code TEXT,
  requirements TEXT[],
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  status event_status DEFAULT 'upcoming',
  featured_image_url TEXT,
  gallery_images TEXT[],
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Event Registrations Table
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  registration_data JSONB,
  special_requirements TEXT,
  dietary_requirements TEXT,
  accessibility_needs TEXT,
  emergency_contact JSONB,
  attendance_status TEXT DEFAULT 'registered', -- 'registered', 'attended', 'no_show', 'cancelled'
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(event_id, user_id)
);

-- 6. Sponsors Table
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  sponsorship_level TEXT, -- 'platinum', 'gold', 'silver', 'bronze', 'supporter'
  sponsorship_amount DECIMAL(10,2),
  benefits JSONB,
  contract_start_date DATE,
  contract_end_date DATE,
  is_active BOOLEAN DEFAULT true,
  social_media JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 7. Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  author_id UUID REFERENCES profiles(id),
  category TEXT,
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  meta_description TEXT,
  meta_keywords TEXT[],
  reading_time INTEGER, -- in minutes
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 8. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'general', -- 'general', 'sponsorship', 'media', 'support'
  status TEXT DEFAULT 'new', -- 'new', 'read', 'responded', 'archived'
  priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high'
  assigned_to UUID REFERENCES profiles(id),
  response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 9. Newsletter Subscriptions Table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  interests TEXT[], -- 'events', 'contestants', 'sponsors', 'general'
  is_active BOOLEAN DEFAULT true,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 10. Media Gallery Table
CREATE TABLE IF NOT EXISTS media_gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL, -- 'image', 'video'
  thumbnail_url TEXT,
  alt_text TEXT, -- for accessibility
  category TEXT, -- 'events', 'contestants', 'behind_scenes', 'awards'
  event_id UUID REFERENCES events(id),
  contestant_id UUID REFERENCES contestants(id),
  tags TEXT[],
  photographer TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  sort_order INTEGER,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);
CREATE INDEX idx_contestants_year ON contestants(year);
CREATE INDEX idx_contestants_is_active ON contestants(is_active);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, published_at);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_media_gallery_category ON media_gallery(category);
CREATE INDEX idx_media_gallery_is_public ON media_gallery(is_public);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contestants ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_gallery ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (comprehensive security policies)

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user has specific role
CREATE OR REPLACE FUNCTION has_role(user_id UUID, required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND role = required_role::user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================
-- PROFILES POLICIES
-- ===================

-- Users can view own profile, admins can view all
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    is_admin(auth.uid())
  );

-- Users can update own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Only authenticated users can insert profiles (handled by triggers)
CREATE POLICY "Authenticated users can create profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile" ON profiles
  FOR UPDATE USING (is_admin(auth.uid()));

-- ===================
-- CONTESTANTS POLICIES
-- ===================

-- Public can read active contestants
CREATE POLICY "Active contestants are publicly readable" ON contestants
  FOR SELECT USING (is_active = true);

-- Users can create their own contestant record
CREATE POLICY "Users can create own contestant record" ON contestants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own contestant record
CREATE POLICY "Users can update own contestant record" ON contestants
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can manage all contestant records
CREATE POLICY "Admins can manage contestants" ON contestants
  FOR ALL USING (is_admin(auth.uid()));

-- ===================
-- APPLICATIONS POLICIES
-- ===================

-- Users can only see their own applications
CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (
    auth.uid() = user_id OR 
    is_admin(auth.uid()) OR
    has_role(auth.uid(), 'judge')
  );

-- Users can create applications
CREATE POLICY "Users can create applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update own applications (only if not submitted)
CREATE POLICY "Users can update own draft applications" ON applications
  FOR UPDATE USING (
    auth.uid() = user_id AND 
    status = 'draft'
  );

-- Admins and judges can update any application
CREATE POLICY "Admins and judges can update applications" ON applications
  FOR UPDATE USING (
    is_admin(auth.uid()) OR 
    has_role(auth.uid(), 'judge')
  );

-- ===================
-- EVENTS POLICIES
-- ===================

-- Events are publicly readable
CREATE POLICY "Events are publicly readable" ON events
  FOR SELECT USING (true);

-- Admins can manage events
CREATE POLICY "Admins can manage events" ON events
  FOR ALL USING (is_admin(auth.uid()));

-- ===================
-- EVENT REGISTRATIONS POLICIES
-- ===================

-- Users can view their own registrations
CREATE POLICY "Users can view own registrations" ON event_registrations
  FOR SELECT USING (
    auth.uid() = user_id OR 
    is_admin(auth.uid())
  );

-- Users can register for events
CREATE POLICY "Users can register for events" ON event_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own registrations
CREATE POLICY "Users can update own registrations" ON event_registrations
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can manage all registrations
CREATE POLICY "Admins can manage registrations" ON event_registrations
  FOR ALL USING (is_admin(auth.uid()));

-- ===================
-- SPONSORS POLICIES
-- ===================

-- Sponsors are publicly readable if active
CREATE POLICY "Active sponsors are publicly readable" ON sponsors
  FOR SELECT USING (is_active = true);

-- Admins can manage sponsors
CREATE POLICY "Admins can manage sponsors" ON sponsors
  FOR ALL USING (is_admin(auth.uid()));

-- ===================
-- BLOG POSTS POLICIES
-- ===================

-- Published blog posts are publicly readable
CREATE POLICY "Published blog posts are publicly readable" ON blog_posts
  FOR SELECT USING (is_published = true);

-- Authors can view their own posts (published or draft)
CREATE POLICY "Authors can view own posts" ON blog_posts
  FOR SELECT USING (
    auth.uid() = author_id OR 
    is_admin(auth.uid())
  );

-- Authors can create blog posts
CREATE POLICY "Authors can create posts" ON blog_posts
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND
    (is_admin(auth.uid()) OR has_role(auth.uid(), 'contestant'))
  );

-- Authors can update their own posts
CREATE POLICY "Authors can update own posts" ON blog_posts
  FOR UPDATE USING (auth.uid() = author_id);

-- Admins can manage all blog posts
CREATE POLICY "Admins can manage blog posts" ON blog_posts
  FOR ALL USING (is_admin(auth.uid()));

-- ===================
-- CONTACT MESSAGES POLICIES
-- ===================

-- Users can create contact messages
CREATE POLICY "Anyone can create contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Only admins can read contact messages
CREATE POLICY "Admins can read contact messages" ON contact_messages
  FOR SELECT USING (is_admin(auth.uid()));

-- Admins can update contact messages
CREATE POLICY "Admins can update contact messages" ON contact_messages
  FOR UPDATE USING (is_admin(auth.uid()));

-- ===================
-- NEWSLETTER POLICIES
-- ===================

-- Anyone can subscribe to newsletter
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscriptions
  FOR INSERT WITH CHECK (true);

-- Users can update their own subscription
CREATE POLICY "Users can update own subscription" ON newsletter_subscriptions
  FOR UPDATE USING (true); -- Email-based identification

-- Admins can read all subscriptions
CREATE POLICY "Admins can read subscriptions" ON newsletter_subscriptions
  FOR SELECT USING (is_admin(auth.uid()));

-- ===================
-- MEDIA GALLERY POLICIES
-- ===================

-- Public media is readable by all
CREATE POLICY "Public media is readable" ON media_gallery
  FOR SELECT USING (is_public = true);

-- Admins can see all media
CREATE POLICY "Admins can see all media" ON media_gallery
  FOR SELECT USING (is_admin(auth.uid()));

-- Authenticated users can upload media
CREATE POLICY "Authenticated users can upload media" ON media_gallery
  FOR INSERT WITH CHECK (
    auth.uid() = uploaded_by AND
    auth.uid() IS NOT NULL
  );

-- Users can update their own uploads
CREATE POLICY "Users can update own uploads" ON media_gallery
  FOR UPDATE USING (auth.uid() = uploaded_by);

-- Admins can manage all media
CREATE POLICY "Admins can manage media" ON media_gallery
  FOR ALL USING (is_admin(auth.uid()));

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contestants_updated_at BEFORE UPDATE ON contestants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sponsors_updated_at BEFORE UPDATE ON sponsors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_gallery_updated_at BEFORE UPDATE ON media_gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
-- You can uncomment these after running the schema

/*
-- Sample admin user (replace with your actual user ID after signup)
INSERT INTO profiles (id, email, full_name, role) VALUES 
  ('00000000-0000-0000-0000-000000000000', 'admin@misssouthafricadisability.co.za', 'System Administrator', 'admin');

-- Sample event
INSERT INTO events (title, description, event_type, start_date, location, status) VALUES
  ('Miss South Africa Disability 2024', 'Annual beauty pageant celebrating women with disabilities', 'pageant', '2024-12-15 18:00:00+02', 'Cape Town International Convention Centre', 'upcoming');

-- Sample blog post
INSERT INTO blog_posts (title, slug, excerpt, content, author_id, is_published, published_at) VALUES
  ('Welcome to Miss South Africa Disability', 'welcome-to-miss-south-africa-disability', 'Learn about our mission to empower women with disabilities', 'Full content here...', '00000000-0000-0000-0000-000000000000', true, NOW());
*/