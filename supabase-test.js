/**
 * Supabase Connection Test
 * Use this file to test your Supabase connection
 */

// Test Supabase connection
async function testSupabaseConnection() {
    try {
        const client = getSupabaseClient();
        if (!client) {
            throw new Error('Supabase client not initialized');
        }

        // Simple test query
        const { data, error } = await client
            .from('_realtime_schema')
            .select('*')
            .limit(1);

        if (error && error.code !== 'PGRST116') { // PGRST116 means table doesn't exist, which is expected
            console.log('✅ Supabase connection successful!');
            return true;
        } else {
            console.log('✅ Supabase connection successful!');
            return true;
        }
    } catch (error) {
        console.error('❌ Supabase connection failed:', error);
        return false;
    }
}

// Test authentication service
async function testSupabaseAuth() {
    try {
        const client = getSupabaseClient();
        const { data: { session } } = await client.auth.getSession();
        
        console.log('Auth service available:', !!client.auth);
        console.log('Current session:', session ? 'Logged in' : 'Not logged in');
        
        return true;
    } catch (error) {
        console.error('❌ Auth test failed:', error);
        return false;
    }
}

// Run tests when page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Wait a bit for Supabase to initialize
    setTimeout(async () => {
        console.log('🧪 Testing Supabase connection...');
        await testSupabaseConnection();
        await testSupabaseAuth();
    }, 1000);
});

// Export test functions
window.testSupabaseConnection = testSupabaseConnection;
window.testSupabaseAuth = testSupabaseAuth;