/**
 * Supabase Configuration
 * Miss South African Disability Website
 * Project: Misssouthafricadisability
 * Project ID: nkehxuiyjgdatkyfvkgq
 */

const SUPABASE_CONFIG = {
    // Your Supabase URL
    url: 'https://nkehxuiyjgdatkyfvkgq.supabase.co',
    
    // Your Supabase anon/public key - you'll need to get this from your Supabase dashboard
    // Go to: https://supabase.com/dashboard/project/nkehxuiyjgdatkyfvkgq/settings/api
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZWh4dWl5amdkYXRreWZ2a2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NTc4OTIsImV4cCI6MjA3NTIzMzg5Mn0.M6BDXx5iwfRhZgXydSKXlMUZBdJlH8ti5w9tH9MtlQY', // Supabase anon key (public)
    
    // Database options
    options: {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            flowType: 'pkce'
        },
        db: {
            schema: 'public'
        },
        realtime: {
            heartbeatIntervalMs: 30000,
            reconnectDelayMs: [1000, 2000, 5000, 10000],
            timeout: 10000
        }
    }
};

// Global Supabase client variable
let supabase;

/**
 * Initialize Supabase client
 * Call this function when the page loads
 */
function initializeSupabase() {
    try {
        if (typeof window.supabase === 'undefined') {
            console.error('Supabase library not loaded. Make sure the CDN script is included.');
            return null;
        }
        
        supabase = window.supabase.createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.anonKey,
            SUPABASE_CONFIG.options
        );
        
        console.log('✅ Supabase initialized successfully');
        return supabase;
    } catch (error) {
        console.error('❌ Error initializing Supabase:', error);
        return null;
    }
}

/**
 * Get the current Supabase client instance
 */
function getSupabaseClient() {
    if (!supabase) {
        return initializeSupabase();
    }
    return supabase;
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSupabase();
});

// Export for use in other scripts
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.initializeSupabase = initializeSupabase;
window.getSupabaseClient = getSupabaseClient;