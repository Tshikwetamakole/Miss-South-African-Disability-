# Miss South African Disability - Supabase Integration Guide

## 🎯 Project Overview

This guide will help you complete the Supabase integration for your Miss South African Disability website. We've already set up the foundation, and here's what you need to do to make it fully functional.

## 📋 Current Progress

✅ **Completed:**
1. Supabase client library installation
2. Configuration files setup
3. Database schema design
4. Authentication system
5. Registration form with database integration

🔄 **Next Steps:** 
6. Get your Supabase API keys
7. Set up database tables
8. Configure file storage
9. Test and deploy

## 🚀 Step-by-Step Implementation Guide

### Step 1: Get Your Supabase API Keys

1. **Go to your Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/nkehxuiyjgdatkyfvkgq
   ```

2. **Navigate to Settings → API**

3. **Copy these values:**
   - **Project URL:** `https://nkehxuiyjgdatkyfvkgq.supabase.co` (already set)
   - **Anon Public Key:** Copy this from the "Project API keys" section

4. **Update the configuration file:**
   - Open `supabase-config.js`
   - Replace `YOUR_ANON_KEY_HERE` with your actual anon key

### Step 2: Create Database Tables

1. **Go to Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/nkehxuiyjgdatkyfvkgq/sql
   ```

2. **Run the database schema:**
   - Copy the contents of `database-schema.sql`
   - Paste into the SQL Editor
   - Click "Run" to create all tables

3. **Run the RLS policies:**
   - Copy the contents of `database-rls-policies.sql`
   - Paste into the SQL Editor
   - Click "Run" to set up security policies

### Step 3: Set Up File Storage

1. **Go to Storage in Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/nkehxuiyjgdatkyfvkgq/storage/buckets
   ```

2. **Create storage buckets:**
   ```sql
   -- Run these in SQL Editor
   INSERT INTO storage.buckets (id, name, public) VALUES 
   ('contestant-documents', 'contestant-documents', true),
   ('gallery-images', 'gallery-images', true),
   ('blog-images', 'blog-images', true);
   ```

3. **Set up storage policies:**
   ```sql
   -- Allow anyone to upload contestant documents
   CREATE POLICY "Anyone can upload contestant documents" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'contestant-documents');

   -- Allow anyone to view uploaded files
   CREATE POLICY "Anyone can view uploaded files" ON storage.objects
   FOR SELECT USING (bucket_id IN ('contestant-documents', 'gallery-images', 'blog-images'));
   ```

### Step 4: Update Your HTML Files

1. **Add Supabase scripts to all HTML files:**
   Add these lines before the closing `</body>` tag in each HTML file:
   ```html
   <!-- Supabase Integration -->
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   <script src="supabase-config.js"></script>
   <script src="auth.js"></script>
   ```

2. **Replace the registration form:**
   - Open `registration.html`
   - Replace the existing form with the content from `enhanced-registration-form.html`
   - Add the registration script:
   ```html
   <script src="registration.js"></script>
   ```

3. **Add authentication modal:**
   - Add the content from `auth-modal.html` to your main pages
   - Include the auth.js script

### Step 5: Test the Connection

1. **Open your website in a browser**
2. **Open browser Developer Tools (F12)**
3. **Check the Console for:**
   - "✅ Supabase initialized successfully"
   - No error messages

4. **Test the connection:**
   - In the browser console, run:
   ```javascript
   testSupabaseConnection();
   ```

### Step 6: Configure Authentication

1. **In Supabase Dashboard, go to Authentication → Settings:**
   ```
   https://supabase.com/dashboard/project/nkehxuiyjgdatkyfvkgq/auth/settings
   ```

2. **Configure Site URL:**
   - Add your website URL (e.g., `https://yourdomain.com`)
   - Add `http://localhost:8000` for local testing

3. **Enable Email Authentication:**
   - Make sure "Enable email confirmations" is turned on
   - Configure email templates if needed

### Step 7: Add Additional Features (Optional)

You can now add these additional features:

1. **Blog System** - Connect your blog to fetch posts from the database
2. **Events Management** - Create and manage events with RSVP functionality
3. **Contact Form** - Store contact submissions in the database
4. **Gallery** - Upload and manage images through Supabase Storage

## 📁 Files Created

Here are all the files we've created for your Supabase integration:

### Core Files:
- `supabase-config.js` - Supabase configuration and initialization
- `auth.js` - Authentication system
- `registration.js` - Registration form handler
- `supabase-test.js` - Connection testing utilities

### HTML Components:
- `auth-modal.html` - Authentication modal component
- `enhanced-registration-form.html` - Complete registration form

### Database Files:
- `database-schema.sql` - Database tables and structure
- `database-rls-policies.sql` - Row Level Security policies

## 🔧 Configuration Checklist

Before going live, make sure you have:

- [ ] Added your Supabase anon key to `supabase-config.js`
- [ ] Created all database tables using `database-schema.sql`
- [ ] Set up RLS policies using `database-rls-policies.sql`
- [ ] Created storage buckets for file uploads
- [ ] Updated all HTML files with Supabase scripts
- [ ] Configured authentication settings in Supabase
- [ ] Tested the connection and authentication
- [ ] Tested the registration form submission

## 🌐 Going Live

1. **Update the configuration for production:**
   ```javascript
   // In supabase-config.js, make sure you have:
   const SUPABASE_CONFIG = {
       url: 'https://nkehxuiyjgdatkyfvkgq.supabase.co',
       anonKey: 'YOUR_ACTUAL_ANON_KEY', // Replace with real key
       // ... rest of config
   };
   ```

2. **Update Site URL in Supabase:**
   - Go to Authentication → Settings
   - Add your production domain to Site URL

3. **Test all functionality:**
   - User registration and login
   - Contestant application submission
   - File uploads
   - Email confirmations

## 🆘 Troubleshooting

### Common Issues:

1. **"Unauthorized" errors:**
   - Check that your anon key is correctly set
   - Verify RLS policies are properly configured

2. **File upload failures:**
   - Ensure storage buckets are created
   - Check file size limits (5MB default)
   - Verify storage policies

3. **Authentication not working:**
   - Check Site URL configuration
   - Verify email settings
   - Test with browser dev tools console

4. **Form submission errors:**
   - Check required fields validation
   - Verify database table structure
   - Check browser console for errors

### Getting Help:

- Check the browser console for error messages
- Use the `testSupabaseConnection()` function to verify connectivity
- Review Supabase Dashboard logs for backend errors
- Test with the `supabase-test.js` utilities

## 📞 Next Steps

Once you have completed this integration:

1. **Test thoroughly** - Test all forms and functionality
2. **Add content** - Create initial blog posts, events, and sponsors
3. **Configure email templates** - Customize authentication emails
4. **Set up monitoring** - Monitor usage and errors in Supabase Dashboard
5. **Add admin panel** - Create admin interface for managing content

Your Miss South African Disability website is now powered by Supabase with:
- ✅ User authentication and profiles
- ✅ Contestant application system
- ✅ File upload capabilities
- ✅ Scalable database infrastructure
- ✅ Real-time features ready
- ✅ Security with Row Level Security

Good luck with your pageant website! 🎉👑♿