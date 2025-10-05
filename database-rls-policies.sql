-- Row Level Security (RLS) Policies
-- Run these SQL commands in your Supabase SQL Editor after creating the tables

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contestants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Contestants policies
CREATE POLICY "Anyone can view approved contestants" ON public.contestants
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can insert their own contestant application" ON public.contestants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contestant application" ON public.contestants
    FOR UPDATE USING (auth.uid() = user_id AND status IN ('pending', 'under_review'));

CREATE POLICY "Admins can view all contestants" ON public.contestants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Blog posts policies
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
    FOR SELECT USING (is_published = true);

CREATE POLICY "Authors can view their own drafts" ON public.blog_posts
    FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Authors can create blog posts" ON public.blog_posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own posts" ON public.blog_posts
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all blog posts" ON public.blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Events policies
CREATE POLICY "Anyone can view public events" ON public.events
    FOR SELECT USING (is_public = true AND is_cancelled = false);

CREATE POLICY "Authenticated users can view all events" ON public.events
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage events" ON public.events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Event RSVPs policies
CREATE POLICY "Users can view their own RSVPs" ON public.event_rsvps
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own RSVPs" ON public.event_rsvps
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own RSVPs" ON public.event_rsvps
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own RSVPs" ON public.event_rsvps
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all RSVPs" ON public.event_rsvps
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Contact submissions policies
CREATE POLICY "Anyone can create contact submissions" ON public.contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all contact submissions" ON public.contact_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update contact submissions" ON public.contact_submissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Sponsors policies
CREATE POLICY "Anyone can view active sponsors" ON public.sponsors
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage sponsors" ON public.sponsors
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Gallery images policies
CREATE POLICY "Anyone can view gallery images" ON public.gallery_images
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage gallery images" ON public.gallery_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Newsletter subscriptions policies
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own subscription" ON public.newsletter_subscriptions
    FOR UPDATE USING (true); -- Allow updates via unsubscribe token

CREATE POLICY "Admins can view all subscriptions" ON public.newsletter_subscriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- System settings policies
CREATE POLICY "Anyone can view public settings" ON public.system_settings
    FOR SELECT USING (is_public = true);

CREATE POLICY "Admins can manage all settings" ON public.system_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile for new users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some initial system settings
INSERT INTO public.system_settings (setting_key, setting_value, description, is_public) VALUES
    ('site_title', '"Miss South African Disability"', 'Website title', true),
    ('site_description', '"Empowering women with disabilities through beauty, advocacy, and leadership"', 'Website description', true),
    ('contact_email', '"info@misssouthafricadisability.co.za"', 'Main contact email', true),
    ('applications_open', 'true', 'Whether applications are currently open', true),
    ('current_year', '2025', 'Current pageant year', true),
    ('max_contestants', '50', 'Maximum number of contestants per year', false)
ON CONFLICT (setting_key) DO NOTHING;