/**
 * Supabase Client Setup
 * Handles database operations, authentication, and real-time subscriptions
 */

// Import Supabase configuration
// Note: Make sure to update supabase-config.js with your actual API key

class SupabaseClient {
  constructor() {
    this.supabase = null;
    this.initialized = false;
    this.currentUser = null;
  }

  /**
   * Initialize Supabase client
   * Call this method before using any Supabase features
   */
  async init() {
    try {
      // Check if we have access to the global Supabase instance
      if (typeof window !== 'undefined' && window.getSupabaseClient) {
        this.supabase = window.getSupabaseClient();
        if (this.supabase) {
          console.log('✅ Using existing Supabase client from global config');
        }
      }
      
      // If no global client, create our own
      if (!this.supabase) {
        // Load Supabase from CDN if not already loaded
        if (typeof window.supabase === 'undefined') {
          await this.loadSupabaseSDK();
        }

        // Create Supabase client using global config or fallback
        const config = window.SUPABASE_CONFIG || {
          url: 'https://nkehxuiyjgdatkyfvkgq.supabase.co',
          anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZWh4dWl5amdkYXRreWZ2a2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NTc4OTIsImV4cCI6MjA3NTIzMzg5Mn0.M6BDXx5iwfRhZgXydSKXlMUZBdJlH8ti5w9tH9MtlQY',
          options: {
            auth: {
              autoRefreshToken: true,
              persistSession: true,
              detectSessionInUrl: true,
              flowType: 'pkce'
            }
          }
        };
        
        this.supabase = window.supabase.createClient(
          config.url,
          config.anonKey,
          config.options
        );
      }

      // Check for existing session
      const { data: { session } } = await this.supabase.auth.getSession();
      this.currentUser = session?.user || null;

      // Listen for auth changes
      this.supabase.auth.onAuthStateChange((event, session) => {
        this.currentUser = session?.user || null;
        this.handleAuthStateChange(event, session);
      });

      this.initialized = true;
      console.log('✅ Supabase client initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Supabase client:', error);
      return false;
    }
  }

  /**
   * Load Supabase SDK from CDN
   */
  async loadSupabaseSDK() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Handle authentication state changes
   */
  handleAuthStateChange(event, session) {
    console.log('Auth state changed:', event, session);
    
    // Update UI based on auth state
    if (event === 'SIGNED_IN') {
      this.onUserSignedIn(session.user);
    } else if (event === 'SIGNED_OUT') {
      this.onUserSignedOut();
    }
  }

  /**
   * User signed in callback
   */
  onUserSignedIn(user) {
    // Update UI for authenticated user
    console.log('User signed in:', user);
    // You can add custom logic here
  }

  /**
   * User signed out callback
   */
  onUserSignedOut() {
    // Update UI for signed out state
    console.log('User signed out');
    // You can add custom logic here
  }

  /**
   * Check if client is initialized
   */
  isInitialized() {
    return this.initialized;
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Get Supabase client instance
   */
  getClient() {
    if (!this.initialized) {
      throw new Error('Supabase client not initialized. Call init() first.');
    }
    return this.supabase;
  }
}

// Create global instance
const supabaseClient = new SupabaseClient();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  await supabaseClient.init();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = supabaseClient;
}