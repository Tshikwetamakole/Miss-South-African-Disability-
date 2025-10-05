-- Miss South African Disability Database Schema
-- Run these SQL commands in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security (RLS) extension
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- 1. User Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    date_of_birth DATE,
    province TEXT,
    city TEXT,
    disability_type TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'contestant', 'admin', 'judge')),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Contestants Table
CREATE TABLE IF NOT EXISTS public.contestants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    application_number TEXT UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    age INTEGER,
    province TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT,
    disability_type TEXT NOT NULL,
    disability_description TEXT,
    medical_clearance BOOLEAN DEFAULT FALSE,
    
    -- Personal Information
    height DECIMAL,
    weight DECIMAL,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    
    -- Background
    education_level TEXT,
    occupation TEXT,
    achievements TEXT,
    hobbies TEXT,
    languages_spoken TEXT[],
    
    -- Pageant Specific
    talent_description TEXT,
    platform_cause TEXT,
    why_compete TEXT,
    previous_pageant_experience TEXT,
    
    -- Documents (stored as file URLs)
    photo_url TEXT,
    id_document_url TEXT,
    medical_certificate_url TEXT,
    
    -- Application Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'withdrawn')),
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    review_date TIMESTAMP WITH TIME ZONE,
    reviewer_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    author_id UUID REFERENCES public.profiles(id),
    category TEXT DEFAULT 'general' CHECK (category IN ('general', 'news', 'success-stories', 'advocacy', 'tips', 'events')),
    tags TEXT[],
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    publish_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_type TEXT DEFAULT 'general' CHECK (event_type IN ('general', 'pageant', 'workshop', 'fundraiser', 'meet-and-greet', 'photoshoot')),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location TEXT NOT NULL,
    venue_address TEXT,
    max_attendees INTEGER,
    registration_required BOOLEAN DEFAULT FALSE,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    entry_fee DECIMAL DEFAULT 0,
    contact_email TEXT,
    contact_phone TEXT,
    image_url TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    is_cancelled BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Event RSVPs Table
CREATE TABLE IF NOT EXISTS public.event_rsvps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    guest_name TEXT,
    guest_email TEXT,
    guest_phone TEXT,
    number_of_guests INTEGER DEFAULT 1,
    dietary_requirements TEXT,
    accessibility_needs TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'attended')),
    rsvp_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(event_id, user_id)
);

-- 6. Contact Form Submissions Table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    contact_type TEXT DEFAULT 'general' CHECK (contact_type IN ('general', 'sponsorship', 'media', 'application-help', 'technical')),
    is_read BOOLEAN DEFAULT FALSE,
    is_replied BOOLEAN DEFAULT FALSE,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Sponsors Table
CREATE TABLE IF NOT EXISTS public.sponsors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    website TEXT,
    logo_url TEXT,
    sponsorship_level TEXT DEFAULT 'bronze' CHECK (sponsorship_level IN ('bronze', 'silver', 'gold', 'platinum', 'title')),
    sponsorship_amount DECIMAL,
    sponsorship_type TEXT DEFAULT 'monetary' CHECK (sponsorship_type IN ('monetary', 'in-kind', 'service', 'media')),
    benefits_provided TEXT,
    contract_start_date DATE,
    contract_end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Gallery Images Table
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    alt_text TEXT NOT NULL,
    category TEXT DEFAULT 'general' CHECK (category IN ('general', 'events', 'contestants', 'winners', 'behind-scenes')),
    event_id UUID REFERENCES public.events(id),
    contestant_id UUID REFERENCES public.contestants(id),
    photographer TEXT,
    taken_date DATE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    uploaded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Newsletter Subscriptions Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    subscription_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    preferences JSONB DEFAULT '{"events": true, "news": true, "success_stories": true}',
    unsubscribe_token TEXT UNIQUE DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. System Settings Table
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contestants_status ON public.contestants(status);
CREATE INDEX IF NOT EXISTS idx_contestants_province ON public.contestants(province);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(is_published, publish_date);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(event_type);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_read ON public.contact_submissions(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contestants_updated_at BEFORE UPDATE ON public.contestants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON public.contact_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sponsors_updated_at BEFORE UPDATE ON public.sponsors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON public.gallery_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_newsletter_subscriptions_updated_at BEFORE UPDATE ON public.newsletter_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();