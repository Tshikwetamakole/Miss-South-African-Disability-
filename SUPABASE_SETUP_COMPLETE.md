# 🚀 Complete Supabase Integration Guide
## Miss South Africa Disability Website

This guide will help you complete the Supabase integration for your Miss South Africa Disability website.

## 📋 Prerequisites

1. **Supabase Account**: Create an account at [supabase.com](https://supabase.com)
2. **Project Setup**: Create a new Supabase project
3. **Database Access**: Get your project URL and API keys

## 🗄️ Database Setup

### Step 1: Run the Database Schema

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `supabase-schema.sql`
4. Click **Run** to create all tables, policies, and functions

### Step 2: Create Storage Buckets

Run these SQL commands in the SQL Editor:

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('profile-images', 'profile-images', true),
  ('contestant-photos', 'contestant-photos', true),
  ('event-images', 'event-images', true),
  ('gallery-media', 'gallery-media', true),
  ('application-documents', 'application-documents', false),
  ('sponsor-logos', 'sponsor-logos', true);
```

### Step 3: Set Up Storage Policies

```sql
-- Allow public read access to public buckets
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id IN ('profile-images', 'contestant-photos', 'event-images', 'gallery-media', 'sponsor-logos'));

-- Allow authenticated uploads
CREATE POLICY "Authenticated uploads" ON storage.objects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to update their own files
CREATE POLICY "Users can update own files" ON storage.objects
  FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
```

## ⚙️ Configuration

### Step 1: Update Supabase Configuration

Your `supabase-config.js` is already configured with:
- **Project URL**: `https://nkehxuiyjgdatkyfvkgq.supabase.co`
- **API Key**: Already included
- **Options**: Properly configured for auth and real-time

### Step 2: Verify Connection

1. Open `supabase-test.html` in your browser
2. Click **"Run All Tests"**
3. Verify all services show ✅ Success

## 🔐 Authentication Setup

### Email Templates (Optional)

1. Go to **Authentication → Email Templates**
2. Customize the confirmation and password reset emails
3. Use your domain: `misssouthafricadisability.co.za`

### Authentication Settings

1. Go to **Authentication → Settings**
2. Enable **Email confirmations**
3. Set **Site URL** to your domain
4. Configure **Redirect URLs** for your pages

## 📁 File Upload Setup

The storage service supports multiple upload types:

### Profile Images
```javascript
await storageService.uploadProfileImage(file, userId);
```

### Contestant Photos
```javascript
await storageService.uploadContestantPhotos(files, contestantId);
```

### Application Documents
```javascript
await storageService.uploadApplicationDocuments(files, userId);
```

### Event Images
```javascript
await storageService.uploadEventImages(files, eventId);
```

## 📡 Real-time Features

Real-time subscriptions are automatically set up for:

- **Events**: Live event updates
- **Gallery**: New media notifications
- **Blog**: New post notifications
- **Applications**: Status change notifications
- **User Updates**: Personal dashboard updates

## 🔒 Security Features

### Row Level Security (RLS)

All tables have RLS enabled with policies for:
- **Public Access**: Events, blog posts, gallery items
- **User-Specific**: Profiles, applications, registrations
- **Admin Access**: Full management capabilities
- **Role-Based**: Contestant, judge, admin permissions

### Data Validation

- Password strength validation
- Email format validation
- File type and size restrictions
- Image processing and optimization

## 🧪 Testing Your Integration

### Run the Test Suite

1. Open `supabase-test.html`
2. Run all tests to verify:
   - ✅ Core configuration
   - ✅ Authentication service
   - ✅ Database connectivity
   - ✅ Real-time features
   - ✅ Storage operations

### Manual Testing

1. **Registration**: Create a test account
2. **Login/Logout**: Verify authentication flow
3. **Profile**: Update user profile information
4. **File Upload**: Test image and document uploads
5. **Real-time**: Open multiple browser tabs to test live updates

## 🌐 Production Deployment

### Environment Variables

For production, consider using environment variables:

```javascript
const SUPABASE_CONFIG = {
    url: process.env.SUPABASE_URL || 'https://nkehxuiyjgdatkyfvkgq.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || 'your-anon-key',
    // ... rest of config
};
```

### CDN and Caching

1. Enable **CDN** in Supabase Storage settings
2. Set appropriate **cache headers** for static assets
3. Use **image transformations** for optimized loading

### Monitoring

1. Enable **Database Statistics** in Supabase
2. Monitor **Auth logs** for security
3. Set up **Webhooks** for critical events
4. Use **Edge Functions** for complex operations

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your domain is added to allowed origins
2. **RLS Policies**: Check that policies allow necessary operations
3. **Storage Access**: Verify bucket policies are correctly set
4. **Real-time Disconnections**: Check network stability and reconnection logic

### Debug Mode

Enable debug logging:

```javascript
// Add to your main script
window.SUPABASE_DEBUG = true;
```

### Support

- **Supabase Docs**: [docs.supabase.com](https://docs.supabase.com)
- **Community**: [discord.gg/supabase](https://discord.gg/supabase)
- **GitHub Issues**: Report bugs and feature requests

## 📚 API Reference

### Authentication Service

```javascript
// Sign up
await authService.signUp(email, password, userData);

// Sign in
await authService.signIn(email, password);

// Sign out
await authService.signOut();

// Get current user
const user = authService.getCurrentUser();

// Update profile
await authService.updateProfile(profileData);
```

### Database Service

```javascript
// Get events
const events = await dbService.getUpcomingEvents();

// Submit application
await dbService.submitApplication(applicationData);

// Subscribe to newsletter
await dbService.subscribeToNewsletter(email, name);

// Global search
const results = await dbService.globalSearch(query);
```

### Storage Service

```javascript
// Upload file
await storageService.uploadFile(file, 'profiles', fileName);

// Get public URL
const url = storageService.getPublicUrl('profiles', fileName);

// List files
const files = await storageService.listFiles('gallery');

// Delete file
await storageService.deleteFile('profiles', fileName);
```

### Real-time Service

```javascript
// Subscribe to table changes
const subscription = dbService.subscribeToTable('events', (payload) => {
    console.log('Change received!', payload);
});

// Unsubscribe
dbService.unsubscribe(subscription);

// Show notifications
realTimeService.showNotification('Title', 'Message', 'success');
```

## ✅ Integration Checklist

- [ ] Database schema applied
- [ ] Storage buckets created
- [ ] RLS policies configured
- [ ] Authentication settings updated
- [ ] Test suite passes
- [ ] File uploads working
- [ ] Real-time features active
- [ ] Email templates customized
- [ ] Production environment configured
- [ ] Monitoring and logging enabled

## 🎉 You're All Set!

Your Miss South Africa Disability website now has a complete Supabase integration with:

- **Secure Authentication** with role-based access
- **Real-time Updates** for dynamic content
- **File Storage** with image processing
- **Database Operations** with RLS security
- **Comprehensive Testing** with automated checks

The integration supports all the features needed for your pageant website, from contestant applications to event management and community engagement.

---

**Need Help?** Check the `supabase-test.html` file for comprehensive testing and debugging tools.