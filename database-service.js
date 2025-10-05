/**
 * Supabase Database Helper Functions
 * Contains functions to interact with your Miss South Africa Disability database
 */

class DatabaseService {
  constructor() {
    this.client = null;
  }

  /**
   * Initialize with Supabase client
   */
  init(supabaseClient) {
    this.client = supabaseClient.getClient();
  }

  // ===================
  // PROFILES FUNCTIONS
  // ===================

  /**
   * Create or update user profile
   */
  async upsertProfile(profileData) {
    try {
      const { data, error } = await this.client
        .from('profiles')
        .upsert(profileData)
        .select();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error upserting profile:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user profile by ID
   */
  async getProfile(userId) {
    try {
      const { data, error } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting profile:', error);
      return { success: false, error: error.message };
    }
  }

  // ===================
  // APPLICATIONS FUNCTIONS
  // ===================

  /**
   * Submit contestant application
   */
  async submitApplication(applicationData) {
    try {
      const { data, error } = await this.client
        .from('applications')
        .insert({
          ...applicationData,
          status: 'submitted',
          submitted_at: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error submitting application:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's applications
   */
  async getUserApplications(userId) {
    try {
      const { data, error } = await this.client
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting applications:', error);
      return { success: false, error: error.message };
    }
  }

  // ===================
  // EVENTS FUNCTIONS
  // ===================

  /**
   * Get all upcoming events
   */
  async getUpcomingEvents() {
    try {
      const { data, error } = await this.client
        .from('events')
        .select('*')
        .eq('status', 'upcoming')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting events:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Register for an event
   */
  async registerForEvent(eventId, userId, registrationData) {
    try {
      const { data, error } = await this.client
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: userId,
          registration_data: registrationData
        })
        .select();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error registering for event:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if user is registered for an event
   */
  async isRegisteredForEvent(eventId, userId) {
    try {
      const { data, error } = await this.client
        .from('event_registrations')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();
      
      return { success: true, registered: !!data };
    } catch (error) {
      return { success: true, registered: false };
    }
  }

  // ===================
  // CONTACT FUNCTIONS
  // ===================

  /**
   * Submit contact message
   */
  async submitContactMessage(messageData) {
    try {
      const { data, error } = await this.client
        .from('contact_messages')
        .insert(messageData)
        .select();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error submitting contact message:', error);
      return { success: false, error: error.message };
    }
  }

  // ===================
  // NEWSLETTER FUNCTIONS
  // ===================

  /**
   * Subscribe to newsletter
   */
  async subscribeToNewsletter(email, name, interests = []) {
    try {
      const { data, error } = await this.client
        .from('newsletter_subscriptions')
        .upsert({
          email,
          name,
          interests,
          is_active: true
        })
        .select();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Unsubscribe from newsletter
   */
  async unsubscribeFromNewsletter(email) {
    try {
      const { data, error } = await this.client
        .from('newsletter_subscriptions')
        .update({
          is_active: false,
          unsubscribed_at: new Date().toISOString()
        })
        .eq('email', email)
        .select();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error unsubscribing from newsletter:', error);
      return { success: false, error: error.message };
    }
  }

  // ===================
  // BLOG FUNCTIONS
  // ===================

  /**
   * Get published blog posts
   */
  async getBlogPosts(limit = 10, offset = 0) {
    try {
      const { data, error } = await this.client
        .from('blog_posts')
        .select(`
          *,
          author:author_id(full_name, profile_image_url)
        `)
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting blog posts:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get single blog post by slug
   */
  async getBlogPost(slug) {
    try {
      const { data, error } = await this.client
        .from('blog_posts')
        .select(`
          *,
          author:author_id(full_name, profile_image_url)
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single();
      
      if (error) throw error;
      
      // Increment view count
      await this.client
        .from('blog_posts')
        .update({ view_count: data.view_count + 1 })
        .eq('id', data.id);
      
      return { success: true, data };
    } catch (error) {
      console.error('Error getting blog post:', error);
      return { success: false, error: error.message };
    }
  }

  // ===================
  // MEDIA GALLERY FUNCTIONS
  // ===================

  /**
   * Get media gallery items
   */
  async getGalleryItems(category = null, limit = 20) {
    try {
      let query = this.client
        .from('media_gallery')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting gallery items:', error);
      return { success: false, error: error.message };
    }
  }

  // ===================
  // CONTESTANTS FUNCTIONS
  // ===================

  /**
   * Get current year contestants
   */
  async getCurrentContestants() {
    try {
      const currentYear = new Date().getFullYear();
      const { data, error } = await this.client
        .from('contestants')
        .select(`
          *,
          profile:user_id(full_name, profile_image_url, location)
        `)
        .eq('year', currentYear)
        .eq('is_active', true)
        .order('contestant_number', { ascending: true });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting contestants:', error);
      return { success: false, error: error.message };
    }
  }

  // ===================
  // SPONSORS FUNCTIONS
  // ===================

  /**
   * Get active sponsors
   */
  async getSponsors() {
    try {
      const { data, error } = await this.client
        .from('sponsors')
        .select('*')
        .eq('is_active', true)
        .order('sponsorship_level', { ascending: true });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting sponsors:', error);
      return { success: false, error: error.message };
    }
  }

  // ===================
  // UTILITY METHODS
  // ===================

  /**
   * Generic database query with error handling
   */
  async executeQuery(queryBuilder) {
    try {
      const { data, error } = await queryBuilder;
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Database query error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if user exists in profiles table
   */
  async userExists(userId) {
    try {
      const { data, error } = await this.client
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
      
      return { success: true, exists: !!data };
    } catch (error) {
      return { success: true, exists: false };
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId) {
    try {
      const [applications, events, messages] = await Promise.all([
        this.getUserApplications(userId),
        this.client.from('event_registrations').select('id').eq('user_id', userId),
        this.client.from('contact_messages').select('id').eq('email', 
          (await this.getProfile(userId)).data?.email || ''
        )
      ]);

      return {
        success: true,
        data: {
          applications: applications.data?.length || 0,
          events: events.data?.length || 0,
          messages: messages.data?.length || 0
        }
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Search across multiple tables
   */
  async globalSearch(query, limit = 20) {
    try {
      const searchResults = await Promise.allSettled([
        // Search blog posts
        this.client
          .from('blog_posts')
          .select('id, title, excerpt, slug, published_at')
          .eq('is_published', true)
          .or(`title.ilike.%${query}%, content.ilike.%${query}%`)
          .limit(limit),
        
        // Search events
        this.client
          .from('events')
          .select('id, title, description, start_date, location')
          .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
          .limit(limit),
        
        // Search contestants
        this.client
          .from('contestants')
          .select('id, user_id, title, platform_statement')
          .eq('is_active', true)
          .or(`title.ilike.%${query}%, platform_statement.ilike.%${query}%`)
          .limit(limit)
      ]);

      const results = {
        blog_posts: searchResults[0].status === 'fulfilled' ? searchResults[0].value.data || [] : [],
        events: searchResults[1].status === 'fulfilled' ? searchResults[1].value.data || [] : [],
        contestants: searchResults[2].status === 'fulfilled' ? searchResults[2].value.data || [] : []
      };

      return { success: true, data: results };
    } catch (error) {
      console.error('Global search error:', error);
      return { success: false, error: error.message };
    }
  }

  // ===================
  // REAL-TIME SUBSCRIPTIONS
  // ===================

  /**
   * Subscribe to real-time updates for a table
   */
  subscribeToTable(tableName, callback, filter = null) {
    if (!this.client) {
      console.error('Database client not initialized');
      return null;
    }

    try {
      let subscription = this.client
        .channel(`${tableName}_changes`)
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: tableName,
            filter: filter 
          }, 
          callback
        )
        .subscribe();
      
      console.log(`📡 Subscribed to ${tableName} changes`);
      return subscription;
    } catch (error) {
      console.error(`Error subscribing to ${tableName}:`, error);
      return null;
    }
  }

  /**
   * Unsubscribe from real-time updates
   */
  unsubscribe(subscription) {
    if (subscription && this.client) {
      this.client.removeChannel(subscription);
      console.log('📡 Unsubscribed from real-time updates');
    }
  }

  /**
   * Get database health status
   */
  async getHealthStatus() {
    try {
      const startTime = Date.now();
      
      // Simple query to test connection
      const { error } = await this.client
        .from('profiles')
        .select('id')
        .limit(1);
      
      const responseTime = Date.now() - startTime;
      
      if (error) throw error;
      
      return {
        success: true,
        status: 'healthy',
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Create global instance
const dbService = new DatabaseService();

// Initialize when Supabase client is ready
document.addEventListener('DOMContentLoaded', async () => {
  // Wait for Supabase client to initialize
  const checkClient = setInterval(() => {
    if (supabaseClient && supabaseClient.isInitialized()) {
      dbService.init(supabaseClient);
      clearInterval(checkClient);
      console.log('✅ Database service initialized');
    }
  }, 100);
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DatabaseService, dbService };
}