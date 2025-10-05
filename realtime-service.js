/**
 * Real-time Service for Miss South Africa Disability
 * Handles live updates, notifications, and real-time features using Supabase Real-time
 */

class RealTimeService {
  constructor() {
    this.client = null;
    this.initialized = false;
    this.subscriptions = new Map();
    this.eventCallbacks = new Map();
  }

  /**
   * Initialize real-time service
   */
  init(supabaseClient) {
    this.client = supabaseClient.getClient();
    this.initialized = true;
    this.setupEventHandlers();
    console.log('✅ Real-time service initialized');
  }

  /**
   * Setup initial event handlers
   */
  setupEventHandlers() {
    // Auto-setup based on page content
    this.autoSetupRealtimeFeatures();
    
    // Setup notifications
    this.setupNotifications();
    
    // Setup live chat if present
    this.setupLiveChat();
  }

  /**
   * Auto-setup real-time features based on page content
   */
  autoSetupRealtimeFeatures() {
    const currentPath = window.location.pathname;
    
    // Events page - live event updates
    if (currentPath.includes('events')) {
      this.subscribeToEvents();
    }
    
    // Gallery page - live media updates
    if (currentPath.includes('gallery')) {
      this.subscribeToGallery();
    }
    
    // Blog page - live blog updates
    if (currentPath.includes('blog')) {
      this.subscribeToBlog();
    }
    
    // Dashboard pages - user-specific updates
    if (currentPath.includes('dashboard') || currentPath.includes('profile')) {
      this.subscribeToUserUpdates();
    }
  }

  // ===================
  // EVENT SUBSCRIPTIONS
  // ===================

  /**
   * Subscribe to event updates
   */
  subscribeToEvents() {
    const subscription = this.client
      .channel('events_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'events'
      }, (payload) => {
        this.handleEventUpdate(payload);
      })
      .subscribe();

    this.subscriptions.set('events', subscription);
    console.log('🔴 Subscribed to event updates');
  }

  /**
   * Handle event updates
   */
  handleEventUpdate(payload) {
    const { eventType, old: oldRecord, new: newRecord } = payload;
    
    switch (eventType) {
      case 'INSERT':
        this.showNotification('New event added!', `${newRecord.title} has been scheduled`, 'info');
        this.updateEventsUI('add', newRecord);
        break;
      case 'UPDATE':
        if (oldRecord.status !== newRecord.status) {
          this.showNotification('Event updated', `${newRecord.title} status changed to ${newRecord.status}`, 'info');
        }
        this.updateEventsUI('update', newRecord);
        break;
      case 'DELETE':
        this.showNotification('Event cancelled', `An event has been cancelled`, 'warning');
        this.updateEventsUI('remove', oldRecord);
        break;
    }
  }

  /**
   * Subscribe to gallery updates
   */
  subscribeToGallery() {
    const subscription = this.client
      .channel('gallery_channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'media_gallery',
        filter: 'is_public=eq.true'
      }, (payload) => {
        this.handleGalleryUpdate(payload);
      })
      .subscribe();

    this.subscriptions.set('gallery', subscription);
    console.log('🔴 Subscribed to gallery updates');
  }

  /**
   * Handle gallery updates
   */
  handleGalleryUpdate(payload) {
    const newMedia = payload.new;
    this.showNotification('New photos added!', 'Check out the latest gallery updates', 'info');
    this.updateGalleryUI(newMedia);
  }

  /**
   * Subscribe to blog updates
   */
  subscribeToBlog() {
    const subscription = this.client
      .channel('blog_channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'blog_posts',
        filter: 'is_published=eq.true'
      }, (payload) => {
        this.handleBlogUpdate(payload);
      })
      .subscribe();

    this.subscriptions.set('blog', subscription);
    console.log('🔴 Subscribed to blog updates');
  }

  /**
   * Handle blog updates
   */
  handleBlogUpdate(payload) {
    const newPost = payload.new;
    this.showNotification('New blog post!', newPost.title, 'info');
    this.updateBlogUI(newPost);
  }

  /**
   * Subscribe to user-specific updates
   */
  subscribeToUserUpdates() {
    const user = authService?.getCurrentUser();
    if (!user) return;

    // Subscribe to application updates
    const appSubscription = this.client
      .channel(`user_applications_${user.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'applications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        this.handleApplicationUpdate(payload);
      })
      .subscribe();

    // Subscribe to event registrations
    const eventSubscription = this.client
      .channel(`user_events_${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'event_registrations',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        this.handleEventRegistrationUpdate(payload);
      })
      .subscribe();

    this.subscriptions.set('user_applications', appSubscription);
    this.subscriptions.set('user_events', eventSubscription);
    console.log('🔴 Subscribed to user updates');
  }

  /**
   * Handle application status updates
   */
  handleApplicationUpdate(payload) {
    const { old: oldApp, new: newApp } = payload;
    
    if (oldApp.status !== newApp.status) {
      let message = '';
      let type = 'info';
      
      switch (newApp.status) {
        case 'under_review':
          message = 'Your application is now under review';
          type = 'info';
          break;
        case 'approved':
          message = 'Congratulations! Your application has been approved';
          type = 'success';
          break;
        case 'rejected':
          message = 'Your application status has been updated';
          type = 'warning';
          break;
      }
      
      this.showNotification('Application Update', message, type);
    }
  }

  /**
   * Handle event registration updates
   */
  handleEventRegistrationUpdate(payload) {
    const { eventType, new: registration } = payload;
    
    if (eventType === 'INSERT') {
      this.showNotification('Registration Confirmed', 'You\'ve been registered for the event', 'success');
    }
  }

  // ===================
  // LIVE CHAT
  // ===================

  /**
   * Setup live chat functionality
   */
  setupLiveChat() {
    const chatWidget = document.querySelector('[data-live-chat]');
    if (!chatWidget) return;

    this.initializeChatWidget(chatWidget);
    this.subscribeToChatMessages();
  }

  /**
   * Initialize chat widget
   */
  initializeChatWidget(widget) {
    if (widget.hasAttribute('data-chat-initialized')) return;
    widget.setAttribute('data-chat-initialized', 'true');

    // Create chat UI
    widget.innerHTML = `
      <div class="chat-header">
        <h3>Live Support</h3>
        <button class="chat-toggle" aria-label="Toggle chat">
          <i class="fas fa-comments"></i>
        </button>
      </div>
      <div class="chat-body" style="display: none;">
        <div class="chat-messages" id="chat-messages"></div>
        <div class="chat-input">
          <input type="text" placeholder="Type your message..." id="chat-input" />
          <button id="chat-send" aria-label="Send message">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    `;

    // Add chat styles
    this.addChatStyles();

    // Bind chat events
    this.bindChatEvents(widget);
  }

  /**
   * Add chat styles
   */
  addChatStyles() {
    if (document.getElementById('chat-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'chat-styles';
    styles.textContent = `
      [data-live-chat] {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 300px;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        border: 1px solid #e5e7eb;
      }
      
      .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: #f97316;
        color: white;
        border-radius: 0.5rem 0.5rem 0 0;
      }
      
      .chat-header h3 {
        margin: 0;
        font-size: 1rem;
      }
      
      .chat-toggle {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1.2rem;
      }
      
      .chat-body {
        height: 300px;
        display: flex;
        flex-direction: column;
      }
      
      .chat-messages {
        flex: 1;
        padding: 1rem;
        overflow-y: auto;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .chat-message {
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.875rem;
      }
      
      .chat-message.user {
        background: #f3f4f6;
        margin-left: 2rem;
      }
      
      .chat-message.support {
        background: #fef3c7;
        margin-right: 2rem;
      }
      
      .chat-input {
        display: flex;
        padding: 1rem;
        gap: 0.5rem;
      }
      
      .chat-input input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.25rem;
        font-size: 0.875rem;
      }
      
      .chat-input button {
        background: #f97316;
        color: white;
        border: none;
        padding: 0.5rem;
        border-radius: 0.25rem;
        cursor: pointer;
      }
      
      @media (max-width: 640px) {
        [data-live-chat] {
          width: calc(100vw - 2rem);
          right: 1rem;
          left: 1rem;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }

  /**
   * Bind chat events
   */
  bindChatEvents(widget) {
    const toggleBtn = widget.querySelector('.chat-toggle');
    const chatBody = widget.querySelector('.chat-body');
    const input = widget.querySelector('#chat-input');
    const sendBtn = widget.querySelector('#chat-send');

    // Toggle chat
    toggleBtn.addEventListener('click', () => {
      const isVisible = chatBody.style.display !== 'none';
      chatBody.style.display = isVisible ? 'none' : 'block';
      
      if (!isVisible) {
        input.focus();
      }
    });

    // Send message on enter
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendChatMessage(input.value.trim());
        input.value = '';
      }
    });

    // Send message on button click
    sendBtn.addEventListener('click', () => {
      this.sendChatMessage(input.value.trim());
      input.value = '';
    });
  }

  /**
   * Send chat message
   */
  async sendChatMessage(message) {
    if (!message) return;

    const user = authService?.getCurrentUser();
    if (!user) {
      this.addChatMessage('Please log in to use live chat', 'support');
      return;
    }

    // Add user message to UI
    this.addChatMessage(message, 'user');

    // Send to support (you can implement this based on your needs)
    // For now, we'll simulate an auto-response
    setTimeout(() => {
      this.addChatMessage('Thank you for your message. A support agent will be with you shortly.', 'support');
    }, 1000);
  }

  /**
   * Add message to chat
   */
  addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;

    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${sender}`;
    messageEl.textContent = message;

    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  /**
   * Subscribe to chat messages (if implementing real-time chat)
   */
  subscribeToChatMessages() {
    // Implementation for real-time chat messages
    // This would require a chat_messages table in your database
  }

  // ===================
  // NOTIFICATIONS
  // ===================

  /**
   * Setup notifications
   */
  setupNotifications() {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Create notification container
    this.createNotificationContainer();
  }

  /**
   * Create notification container
   */
  createNotificationContainer() {
    if (document.getElementById('notification-container')) return;

    const container = document.createElement('div');
    container.id = 'notification-container';
    container.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      z-index: 9999;
      max-width: 400px;
    `;
    
    document.body.appendChild(container);
  }

  /**
   * Show notification
   */
  showNotification(title, message, type = 'info', duration = 5000) {
    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/assets/logos/logo.svg'
      });
    }

    // Show in-app notification
    this.showInAppNotification(title, message, type, duration);
  }

  /**
   * Show in-app notification
   */
  showInAppNotification(title, message, type, duration) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-header">
          <strong>${title}</strong>
          <button class="notification-close" aria-label="Close notification">×</button>
        </div>
        <div class="notification-message">${message}</div>
      </div>
    `;

    // Add styles
    notification.style.cssText = `
      background: ${this.getNotificationBg(type)};
      color: ${this.getNotificationColor(type)};
      border: 1px solid ${this.getNotificationBorder(type)};
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      animation: slideIn 0.3s ease-out;
    `;

    // Add animation styles
    if (!document.getElementById('notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'notification-styles';
      styles.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .notification-content {
          font-size: 0.875rem;
        }
        
        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }
        
        .notification-close {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: inherit;
        }
      `;
      document.head.appendChild(styles);
    }

    // Add to container
    container.appendChild(notification);

    // Handle close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.remove();
    });

    // Auto-remove after duration
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, duration);
  }

  /**
   * Get notification background color
   */
  getNotificationBg(type) {
    const colors = {
      success: '#dcfce7',
      error: '#fef2f2',
      warning: '#fef3c7',
      info: '#e0f2fe'
    };
    return colors[type] || colors.info;
  }

  /**
   * Get notification text color
   */
  getNotificationColor(type) {
    const colors = {
      success: '#166534',
      error: '#dc2626',
      warning: '#d97706',
      info: '#0369a1'
    };
    return colors[type] || colors.info;
  }

  /**
   * Get notification border color
   */
  getNotificationBorder(type) {
    const colors = {
      success: '#bbf7d0',
      error: '#fecaca',
      warning: '#fde68a',
      info: '#bae6fd'
    };
    return colors[type] || colors.info;
  }

  // ===================
  // UI UPDATE METHODS
  // ===================

  /**
   * Update events UI
   */
  updateEventsUI(action, eventData) {
    const eventsContainer = document.querySelector('[data-events-container]');
    if (!eventsContainer) return;

    switch (action) {
      case 'add':
        this.addEventToUI(eventsContainer, eventData);
        break;
      case 'update':
        this.updateEventInUI(eventsContainer, eventData);
        break;
      case 'remove':
        this.removeEventFromUI(eventsContainer, eventData);
        break;
    }
  }

  /**
   * Update gallery UI
   */
  updateGalleryUI(mediaData) {
    const galleryContainer = document.querySelector('[data-gallery-container]');
    if (!galleryContainer) return;

    // Add new media item
    const mediaEl = this.createMediaElement(mediaData);
    galleryContainer.insertBefore(mediaEl, galleryContainer.firstChild);
  }

  /**
   * Update blog UI
   */
  updateBlogUI(postData) {
    const blogContainer = document.querySelector('[data-blog-container]');
    if (!blogContainer) return;

    // Add new blog post
    const postEl = this.createBlogPostElement(postData);
    blogContainer.insertBefore(postEl, blogContainer.firstChild);
  }

  // ===================
  // UTILITY METHODS
  // ===================

  /**
   * Unsubscribe from all real-time updates
   */
  unsubscribeAll() {
    this.subscriptions.forEach((subscription, key) => {
      this.client.removeChannel(subscription);
      console.log(`🔴 Unsubscribed from ${key}`);
    });
    this.subscriptions.clear();
  }

  /**
   * Unsubscribe from specific channel
   */
  unsubscribe(channelName) {
    const subscription = this.subscriptions.get(channelName);
    if (subscription) {
      this.client.removeChannel(subscription);
      this.subscriptions.delete(channelName);
      console.log(`🔴 Unsubscribed from ${channelName}`);
    }
  }

  /**
   * Check if service is initialized
   */
  isInitialized() {
    return this.initialized;
  }
}

// Create global instance
const realTimeService = new RealTimeService();

// Initialize when Supabase client is ready
document.addEventListener('DOMContentLoaded', async () => {
  const checkClient = setInterval(() => {
    if (supabaseClient && supabaseClient.isInitialized()) {
      realTimeService.init(supabaseClient);
      clearInterval(checkClient);
    }
  }, 100);
});

// Clean up subscriptions when page unloads
window.addEventListener('beforeunload', () => {
  if (realTimeService.initialized) {
    realTimeService.unsubscribeAll();
  }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RealTimeService, realTimeService };
}