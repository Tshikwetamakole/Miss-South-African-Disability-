/**
 * Authentication Service for Miss South Africa Disability
 * Handles user registration, login, logout, and role management
 */

class AuthService {
  constructor() {
    this.client = null;
    this.currentUser = null;
    this.initialized = false;
  }

  /**
   * Initialize with Supabase client
   */
  init(supabaseClient) {
    this.client = supabaseClient.getClient();
    this.currentUser = supabaseClient.getCurrentUser();
    this.initialized = true;
    
    // Listen for auth state changes
    this.client.auth.onAuthStateChange((event, session) => {
      this.handleAuthStateChange(event, session);
    });
  }

  /**
   * Handle authentication state changes
   */
  handleAuthStateChange(event, session) {
    this.currentUser = session?.user || null;
    
    switch (event) {
      case 'SIGNED_IN':
        this.onSignIn(session.user);
        break;
      case 'SIGNED_OUT':
        this.onSignOut();
        break;
      case 'TOKEN_REFRESHED':
        console.log('Token refreshed');
        break;
    }
  }

  /**
   * User signed in callback
   */
  async onSignIn(user) {
    console.log('User signed in:', user);
    
    // Create or update user profile
    await this.ensureProfile(user);
    
    // Update UI
    this.updateAuthUI(true);
    
    // Redirect based on user role
    await this.handlePostLoginRedirect(user);
  }

  /**
   * User signed out callback
   */
  onSignOut() {
    console.log('User signed out');
    this.currentUser = null;
    this.updateAuthUI(false);
    
    // Redirect to home page
    if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
      window.location.href = '/';
    }
  }

  // ===================
  // AUTHENTICATION METHODS
  // ===================

  /**
   * Sign up with email and password
   */
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await this.client.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName || '',
            phone: userData.phone || '',
            role: userData.role || 'visitor'
          }
        }
      });

      if (error) throw error;

      return {
        success: true,
        data,
        message: 'Registration successful! Please check your email to verify your account.'
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email, password) {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return {
        success: true,
        data,
        message: 'Login successful!'
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Sign out
   */
  async signOut() {
    try {
      const { error } = await this.client.auth.signOut();
      if (error) throw error;

      return {
        success: true,
        message: 'Signed out successfully!'
      };
    } catch (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email) {
    try {
      const { error } = await this.client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password.html`
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Password reset email sent! Please check your inbox.'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update password
   */
  async updatePassword(newPassword) {
    try {
      const { error } = await this.client.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Password updated successfully!'
      };
    } catch (error) {
      console.error('Update password error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===================
  // PROFILE MANAGEMENT
  // ===================

  /**
   * Ensure user profile exists
   */
  async ensureProfile(user) {
    try {
      // Check if profile exists
      const { data: existingProfile } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        // Create new profile
        const { error } = await this.client
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || '',
            phone: user.user_metadata?.phone || '',
            role: user.user_metadata?.role || 'visitor'
          });

        if (error) throw error;
        console.log('Profile created for user:', user.id);
      }
    } catch (error) {
      console.error('Error ensuring profile:', error);
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentProfile() {
    if (!this.currentUser) return null;

    try {
      const { data, error } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', this.currentUser.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    if (!this.currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const { data, error } = await this.client
        .from('profiles')
        .update(profileData)
        .eq('id', this.currentUser.id)
        .select();

      if (error) throw error;

      return {
        success: true,
        data,
        message: 'Profile updated successfully!'
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===================
  // ROLE MANAGEMENT
  // ===================

  /**
   * Check if user has specific role
   */
  async hasRole(role) {
    const profile = await this.getCurrentProfile();
    return profile?.role === role;
  }

  /**
   * Check if user is admin
   */
  async isAdmin() {
    return await this.hasRole('admin');
  }

  /**
   * Check if user is contestant
   */
  async isContestant() {
    return await this.hasRole('contestant');
  }

  /**
   * Check if user is judge
   */
  async isJudge() {
    return await this.hasRole('judge');
  }

  // ===================
  // UI HELPERS
  // ===================

  /**
   * Update authentication UI elements
   */
  updateAuthUI(isSignedIn) {
    // Update navigation
    const authButtons = document.querySelectorAll('[data-auth-show]');
    const guestButtons = document.querySelectorAll('[data-auth-hide]');
    const userInfo = document.querySelectorAll('[data-user-info]');

    authButtons.forEach(btn => {
      btn.style.display = isSignedIn ? 'block' : 'none';
    });

    guestButtons.forEach(btn => {
      btn.style.display = isSignedIn ? 'none' : 'block';
    });

    if (isSignedIn && this.currentUser) {
      userInfo.forEach(info => {
        info.textContent = this.currentUser.email;
        info.style.display = 'block';
      });
    } else {
      userInfo.forEach(info => {
        info.style.display = 'none';
      });
    }
  }

  /**
   * Handle post-login redirect based on user role
   */
  async handlePostLoginRedirect(user) {
    const profile = await this.getCurrentProfile();
    const currentPath = window.location.pathname;

    // Don't redirect if already on appropriate page
    if (currentPath.includes('dashboard') || currentPath.includes('profile')) {
      return;
    }

    // Redirect based on role
    switch (profile?.role) {
      case 'admin':
        // Redirect to admin dashboard (you'll need to create this)
        window.location.href = '/admin-dashboard.html';
        break;
      case 'contestant':
        // Redirect to contestant dashboard
        window.location.href = '/contestant-dashboard.html';
        break;
      case 'judge':
        // Redirect to judge dashboard
        window.location.href = '/judge-dashboard.html';
        break;
      default:
        // Stay on current page or redirect to profile
        if (currentPath === '/login.html' || currentPath === '/register.html') {
          window.location.href = '/profile.html';
        }
    }
  }

  // ===================
  // SECURITY METHODS
  // ===================

  /**
   * Validate password strength
   */
  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    const errors = [];
    
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
      errors.push('Password must contain at least one number');
    }
    if (!hasSpecialChars) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors,
      strength: this.calculatePasswordStrength(password)
    };
  }

  /**
   * Calculate password strength score
   */
  calculatePasswordStrength(password) {
    let score = 0;
    
    // Length bonus
    score += Math.min(password.length * 2, 25);
    
    // Character type bonuses
    if (/[a-z]/.test(password)) score += 5;
    if (/[A-Z]/.test(password)) score += 5;
    if (/\d/.test(password)) score += 5;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 10;
    
    // Variety bonus
    const uniqueChars = new Set(password).size;
    score += uniqueChars * 2;
    
    // Cap at 100
    score = Math.min(score, 100);
    
    if (score < 30) return 'weak';
    if (score < 60) return 'medium';
    if (score < 80) return 'strong';
    return 'very-strong';
  }

  /**
   * Validate email format
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(email),
      error: emailRegex.test(email) ? null : 'Invalid email format'
    };
  }

  /**
   * Check if email is already registered
   */
  async checkEmailExists(email) {
    try {
      // This is a simple check - in production you might want a more secure method
      const { data, error } = await this.client
        .from('profiles')
        .select('email')
        .eq('email', email.toLowerCase())
        .single();
      
      return {
        exists: !!data,
        error: error && error.code !== 'PGRST116' ? error.message : null
      };
    } catch (error) {
      console.error('Email check error:', error);
      return { exists: false, error: error.message };
    }
  }

  /**
   * Log security event
   */
  async logSecurityEvent(event, details = {}) {
    try {
      const eventData = {
        user_id: this.currentUser?.id || null,
        event_type: event,
        details: details,
        ip_address: await this.getUserIP(),
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };
      
      // In a production app, you might want to log this to a security events table
      console.log('Security Event:', eventData);
      
      return { success: true };
    } catch (error) {
      console.error('Security logging error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user IP address (simplified version)
   */
  async getUserIP() {
    try {
      // In production, you might use a service like ipapi.co or similar
      return 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  // ===================
  // SESSION MANAGEMENT
  // ===================

  /**
   * Refresh user session
   */
  async refreshSession() {
    try {
      const { data, error } = await this.client.auth.refreshSession();
      if (error) throw error;
      
      this.currentUser = data.user;
      return { success: true, session: data.session };
    } catch (error) {
      console.error('Session refresh error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get session expiry time
   */
  async getSessionExpiry() {
    try {
      const session = await this.getSession();
      if (!session) return null;
      
      return new Date(session.expires_at * 1000);
    } catch (error) {
      console.error('Session expiry error:', error);
      return null;
    }
  }

  /**
   * Check if session is about to expire (within 5 minutes)
   */
  async isSessionExpiringSoon() {
    try {
      const expiry = await this.getSessionExpiry();
      if (!expiry) return false;
      
      const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
      return expiry <= fiveMinutesFromNow;
    } catch (error) {
      console.error('Session expiry check error:', error);
      return false;
    }
  }

  // ===================
  // UTILITY METHODS
  // ===================

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.currentUser;
  }

  /**
   * Require authentication (redirect to login if not authenticated)
   */
  requireAuth(redirectUrl = '/login.html') {
    if (!this.isAuthenticated()) {
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `${redirectUrl}?redirect=${encodeURIComponent(currentPath)}`;
      return false;
    }
    return true;
  }

  /**
   * Handle redirect after login
   */
  handlePostLoginRedirectFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect');
    
    if (redirectUrl && redirectUrl !== window.location.pathname) {
      window.location.href = redirectUrl;
      return true;
    }
    
    return false;
  }

  /**
   * Get session
   */
  async getSession() {
    try {
      const { data: { session }, error } = await this.client.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  /**
   * Get auth status summary
   */
  async getAuthStatus() {
    try {
      const session = await this.getSession();
      const profile = await this.getCurrentProfile();
      
      return {
        isAuthenticated: this.isAuthenticated(),
        user: this.currentUser,
        profile: profile,
        session: {
          exists: !!session,
          expiresAt: session?.expires_at ? new Date(session.expires_at * 1000) : null,
          isExpiringSoon: await this.isSessionExpiringSoon()
        }
      };
    } catch (error) {
      console.error('Auth status error:', error);
      return {
        isAuthenticated: false,
        error: error.message
      };
    }
  }
}

// Create global instance
const authService = new AuthService();

// Initialize when Supabase client is ready
document.addEventListener('DOMContentLoaded', async () => {
  const checkClient = setInterval(() => {
    if (supabaseClient && supabaseClient.isInitialized()) {
      authService.init(supabaseClient);
      clearInterval(checkClient);
      console.log('✅ Auth service initialized');
    }
  }, 100);
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AuthService, authService };
}