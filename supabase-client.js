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
      // Load Supabase from CDN if not already loaded
      if (typeof supabase === 'undefined') {
        await this.loadSupabaseSDK();
      }

      // Create Supabase client
      this.supabase = supabase.createClient(
        SUPABASE_CONFIG.url,
        SUPABASE_CONFIG.anonKey,
        SUPABASE_CONFIG.options
      );

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