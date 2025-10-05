/**
 * Authentication Module
 * Miss South African Disability Website
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.authListeners = [];
        this.init();
    }

    async init() {
        const client = getSupabaseClient();
        if (!client) return;

        // Listen for auth state changes
        client.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event);
            this.currentUser = session?.user || null;
            this.updateUI();
            this.notifyListeners(event, session);
        });

        // Get initial session
        const { data: { session } } = await client.auth.getSession();
        this.currentUser = session?.user || null;
        this.updateUI();
    }

    // Sign up new user
    async signUp(email, password, userData = {}) {
        try {
            const client = getSupabaseClient();
            const { data, error } = await client.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: userData.fullName || '',
                        phone: userData.phone || '',
                        role: 'user'
                    }
                }
            });

            if (error) throw error;

            return {
                success: true,
                user: data.user,
                message: 'Please check your email to confirm your account.'
            };
        } catch (error) {
            console.error('Sign up error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Sign in user
    async signIn(email, password) {
        try {
            const client = getSupabaseClient();
            const { data, error } = await client.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            return {
                success: true,
                user: data.user,
                session: data.session
            };
        } catch (error) {
            console.error('Sign in error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Sign out user
    async signOut() {
        try {
            const client = getSupabaseClient();
            const { error } = await client.auth.signOut();
            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Reset password
    async resetPassword(email) {
        try {
            const client = getSupabaseClient();
            const { error } = await client.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password.html`
            });

            if (error) throw error;

            return {
                success: true,
                message: 'Password reset email sent. Please check your inbox.'
            };
        } catch (error) {
            console.error('Reset password error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Update user profile
    async updateProfile(updates) {
        try {
            const client = getSupabaseClient();
            
            // Update auth user metadata
            const { data: authData, error: authError } = await client.auth.updateUser({
                data: updates
            });

            if (authError) throw authError;

            // Update profile table
            const { data: profileData, error: profileError } = await client
                .from('profiles')
                .update(updates)
                .eq('id', this.currentUser.id)
                .select();

            if (profileError) throw profileError;

            return {
                success: true,
                profile: profileData[0]
            };
        } catch (error) {
            console.error('Update profile error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get user profile
    async getUserProfile(userId = null) {
        try {
            const client = getSupabaseClient();
            const id = userId || this.currentUser?.id;

            if (!id) throw new Error('No user ID provided');

            const { data, error } = await client
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            return {
                success: true,
                profile: data
            };
        } catch (error) {
            console.error('Get profile error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.currentUser;
    }

    // Check if user has a specific role
    async hasRole(role) {
        if (!this.currentUser) return false;

        try {
            const { profile } = await this.getUserProfile();
            return profile?.role === role;
        } catch (error) {
            console.error('Role check error:', error);
            return false;
        }
    }

    // Add auth state listener
    addAuthListener(callback) {
        this.authListeners.push(callback);
    }

    // Remove auth state listener
    removeAuthListener(callback) {
        this.authListeners = this.authListeners.filter(listener => listener !== callback);
    }

    // Notify all listeners
    notifyListeners(event, session) {
        this.authListeners.forEach(callback => {
            try {
                callback(event, session);
            } catch (error) {
                console.error('Auth listener error:', error);
            }
        });
    }

    // Update UI based on auth state
    updateUI() {
        const loginElements = document.querySelectorAll('.auth-login');
        const logoutElements = document.querySelectorAll('.auth-logout');
        const userElements = document.querySelectorAll('.auth-user');

        if (this.isAuthenticated()) {
            // Show authenticated UI
            loginElements.forEach(el => el.style.display = 'none');
            logoutElements.forEach(el => el.style.display = 'block');
            userElements.forEach(el => {
                el.style.display = 'block';
                const nameEl = el.querySelector('.user-name');
                if (nameEl) {
                    nameEl.textContent = this.currentUser.user_metadata?.full_name || 
                                       this.currentUser.email || 'User';
                }
            });
        } else {
            // Show unauthenticated UI
            loginElements.forEach(el => el.style.display = 'block');
            logoutElements.forEach(el => el.style.display = 'none');
            userElements.forEach(el => el.style.display = 'none');
        }
    }

    // Show auth modal
    showAuthModal(mode = 'login') {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'block';
            this.switchAuthMode(mode);
        }
    }

    // Hide auth modal
    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Switch between login and signup modes
    switchAuthMode(mode) {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const forgotForm = document.getElementById('forgotPasswordForm');

        if (loginForm) loginForm.style.display = mode === 'login' ? 'block' : 'none';
        if (signupForm) signupForm.style.display = mode === 'signup' ? 'block' : 'none';
        if (forgotForm) forgotForm.style.display = mode === 'forgot' ? 'block' : 'none';
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Auth-related DOM event handlers
document.addEventListener('DOMContentLoaded', function() {
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = e.target.email.value;
            const password = e.target.password.value;
            
            const result = await authManager.signIn(email, password);
            
            if (result.success) {
                authManager.hideAuthModal();
                showNotification('Welcome back!', 'success');
            } else {
                showNotification(result.error, 'error');
            }
        });
    }

    // Signup form handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const userData = {
                email: formData.get('email'),
                password: formData.get('password'),
                fullName: formData.get('fullName'),
                phone: formData.get('phone')
            };
            
            const result = await authManager.signUp(userData.email, userData.password, userData);
            
            if (result.success) {
                authManager.hideAuthModal();
                showNotification(result.message, 'success');
            } else {
                showNotification(result.error, 'error');
            }
        });
    }

    // Forgot password form handler
    const forgotForm = document.getElementById('forgotPasswordForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = e.target.email.value;
            const result = await authManager.resetPassword(email);
            
            if (result.success) {
                authManager.hideAuthModal();
                showNotification(result.message, 'success');
            } else {
                showNotification(result.error, 'error');
            }
        });
    }

    // Logout button handlers
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const result = await authManager.signOut();
            if (result.success) {
                showNotification('You have been logged out.', 'info');
                // Redirect to home page if needed
                if (window.location.pathname !== '/') {
                    window.location.href = '/';
                }
            }
        });
    });

    // Auth modal triggers
    document.querySelectorAll('.login-trigger').forEach(btn => {
        btn.addEventListener('click', () => authManager.showAuthModal('login'));
    });

    document.querySelectorAll('.signup-trigger').forEach(btn => {
        btn.addEventListener('click', () => authManager.showAuthModal('signup'));
    });

    // Close modal handlers
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => authManager.hideAuthModal());
    });

    // Switch auth mode handlers
    document.querySelectorAll('.switch-to-login').forEach(btn => {
        btn.addEventListener('click', () => authManager.switchAuthMode('login'));
    });

    document.querySelectorAll('.switch-to-signup').forEach(btn => {
        btn.addEventListener('click', () => authManager.switchAuthMode('signup'));
    });

    document.querySelectorAll('.switch-to-forgot').forEach(btn => {
        btn.addEventListener('click', () => authManager.switchAuthMode('forgot'));
    });
});

// Utility function for notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Export auth manager for global use
window.authManager = authManager;
window.showNotification = showNotification;