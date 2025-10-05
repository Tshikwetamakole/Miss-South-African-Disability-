/**
 * Storage Service for Miss South Africa Disability
 * Handles file uploads, image processing, and document management using Supabase Storage
 */

class StorageService {
  constructor() {
    this.client = null;
    this.initialized = false;
    this.buckets = {
      profiles: 'profile-images',
      contestants: 'contestant-photos',
      events: 'event-images',
      gallery: 'gallery-media',
      documents: 'application-documents',
      logos: 'sponsor-logos'
    };
  }

  /**
   * Initialize storage service
   */
  init(supabaseClient) {
    this.client = supabaseClient.getClient();
    this.initialized = true;
    this.initializeUploadHandlers();
    console.log('✅ Storage service initialized');
  }

  /**
   * Initialize file upload handlers
   */
  initializeUploadHandlers() {
    // Auto-bind file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => this.bindFileInput(input));

    // Drag and drop areas
    const dropZones = document.querySelectorAll('[data-drop-zone]');
    dropZones.forEach(zone => this.bindDropZone(zone));
  }

  // ===================
  // FILE UPLOAD METHODS
  // ===================

  /**
   * Upload a single file to a bucket
   */
  async uploadFile(file, bucketName, fileName = null, options = {}) {
    if (!this.initialized) {
      throw new Error('Storage service not initialized');
    }

    try {
      // Validate file
      this.validateFile(file, options);

      // Generate filename if not provided
      if (!fileName) {
        fileName = this.generateFileName(file);
      }

      // Get bucket
      const bucket = this.buckets[bucketName] || bucketName;

      // Upload file
      const { data, error } = await this.client.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: options.upsert || false,
          ...options.uploadOptions
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = this.client.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return {
        success: true,
        data: {
          path: data.path,
          publicUrl: publicUrl,
          fullPath: data.fullPath
        }
      };

    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(files, bucketName, options = {}) {
    const results = [];
    
    for (const file of files) {
      const result = await this.uploadFile(file, bucketName, null, options);
      results.push({
        file: file.name,
        ...result
      });
    }

    return results;
  }

  /**
   * Upload profile image
   */
  async uploadProfileImage(file, userId) {
    const fileName = `${userId}/avatar.${this.getFileExtension(file)}`;
    return await this.uploadFile(file, 'profiles', fileName, {
      upsert: true,
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
    });
  }

  /**
   * Upload contestant photos
   */
  async uploadContestantPhotos(files, contestantId) {
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `${contestantId}/photo-${i + 1}.${this.getFileExtension(file)}`;
      
      const result = await this.uploadFile(file, 'contestants', fileName, {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
      });
      
      results.push({
        file: file.name,
        index: i + 1,
        ...result
      });
    }

    return results;
  }

  /**
   * Upload application documents
   */
  async uploadApplicationDocuments(files, userId) {
    const results = [];
    
    for (const file of files) {
      const fileName = `${userId}/${Date.now()}-${file.name}`;
      
      const result = await this.uploadFile(file, 'documents', fileName, {
        maxSize: 25 * 1024 * 1024, // 25MB
        allowedTypes: [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
      });
      
      results.push({
        file: file.name,
        ...result
      });
    }

    return results;
  }

  /**
   * Upload event images
   */
  async uploadEventImages(files, eventId) {
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `${eventId}/${Date.now()}-${i}.${this.getFileExtension(file)}`;
      
      const result = await this.uploadFile(file, 'events', fileName, {
        maxSize: 15 * 1024 * 1024, // 15MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
      });
      
      results.push({
        file: file.name,
        ...result
      });
    }

    return results;
  }

  // ===================
  // FILE MANAGEMENT
  // ===================

  /**
   * Delete a file
   */
  async deleteFile(bucketName, fileName) {
    try {
      const bucket = this.buckets[bucketName] || bucketName;
      const { error } = await this.client.storage
        .from(bucket)
        .remove([fileName]);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get file public URL
   */
  getPublicUrl(bucketName, fileName) {
    const bucket = this.buckets[bucketName] || bucketName;
    const { data } = this.client.storage
      .from(bucket)
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  }

  /**
   * Create signed URL for private files
   */
  async createSignedUrl(bucketName, fileName, expiresIn = 3600) {
    try {
      const bucket = this.buckets[bucketName] || bucketName;
      const { data, error } = await this.client.storage
        .from(bucket)
        .createSignedUrl(fileName, expiresIn);

      if (error) throw error;

      return { success: true, signedUrl: data.signedUrl };
    } catch (error) {
      console.error('Signed URL error:', error);
      return { success: false, error: error.message };
    }
  }

  // ===================
  // FILE INPUT HANDLERS
  // ===================

  /**
   * Bind file input element
   */
  bindFileInput(input) {
    if (input.hasAttribute('data-storage-bound')) return;
    input.setAttribute('data-storage-bound', 'true');

    input.addEventListener('change', async (event) => {
      await this.handleFileInputChange(event);
    });
  }

  /**
   * Handle file input change
   */
  async handleFileInputChange(event) {
    const input = event.target;
    const files = Array.from(input.files);
    
    if (files.length === 0) return;

    const uploadType = input.dataset.uploadType || 'general';
    const bucketName = input.dataset.bucket || 'documents';
    const maxFiles = parseInt(input.dataset.maxFiles) || files.length;
    const showProgress = input.dataset.showProgress !== 'false';

    try {
      // Limit number of files
      const filesToUpload = files.slice(0, maxFiles);

      // Show upload progress
      if (showProgress) {
        this.showUploadProgress(input, filesToUpload.length);
      }

      // Upload files based on type
      let results;
      const userId = authService?.getCurrentUser()?.id;

      switch (uploadType) {
        case 'profile':
          if (!userId) throw new Error('User not authenticated');
          results = [await this.uploadProfileImage(filesToUpload[0], userId)];
          break;
        case 'contestant':
          const contestantId = input.dataset.contestantId || userId;
          if (!contestantId) throw new Error('Contestant ID required');
          results = await this.uploadContestantPhotos(filesToUpload, contestantId);
          break;
        case 'documents':
          if (!userId) throw new Error('User not authenticated');
          results = await this.uploadApplicationDocuments(filesToUpload, userId);
          break;
        case 'event':
          const eventId = input.dataset.eventId;
          if (!eventId) throw new Error('Event ID required');
          results = await this.uploadEventImages(filesToUpload, eventId);
          break;
        default:
          results = await this.uploadFiles(filesToUpload, bucketName);
      }

      // Handle results
      this.handleUploadResults(input, results);

    } catch (error) {
      console.error('File input error:', error);
      this.showUploadError(input, error.message);
    }
  }

  /**
   * Bind drag and drop zone
   */
  bindDropZone(zone) {
    if (zone.hasAttribute('data-drop-bound')) return;
    zone.setAttribute('data-drop-bound', 'true');

    // Add visual feedback
    zone.style.cssText += `
      border: 2px dashed #e5e7eb;
      border-radius: 0.5rem;
      padding: 2rem;
      text-align: center;
      transition: all 0.2s;
      cursor: pointer;
    `;

    // Drag events
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.style.borderColor = '#f97316';
      zone.style.backgroundColor = '#fff7ed';
    });

    zone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      zone.style.borderColor = '#e5e7eb';
      zone.style.backgroundColor = 'transparent';
    });

    zone.addEventListener('drop', async (e) => {
      e.preventDefault();
      zone.style.borderColor = '#e5e7eb';
      zone.style.backgroundColor = 'transparent';

      const files = Array.from(e.dataTransfer.files);
      await this.handleDropZoneUpload(zone, files);
    });

    // Click to select files
    zone.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = zone.dataset.multiple !== 'false';
      input.accept = zone.dataset.accept || '*';
      
      input.addEventListener('change', async () => {
        const files = Array.from(input.files);
        await this.handleDropZoneUpload(zone, files);
      });
      
      input.click();
    });
  }

  /**
   * Handle drop zone upload
   */
  async handleDropZoneUpload(zone, files) {
    if (files.length === 0) return;

    const uploadType = zone.dataset.uploadType || 'general';
    const bucketName = zone.dataset.bucket || 'documents';

    try {
      this.showUploadProgress(zone, files.length);
      
      const userId = authService?.getCurrentUser()?.id;
      let results;

      switch (uploadType) {
        case 'gallery':
          results = await this.uploadFiles(files, 'gallery');
          break;
        case 'documents':
          if (!userId) throw new Error('User not authenticated');
          results = await this.uploadApplicationDocuments(files, userId);
          break;
        default:
          results = await this.uploadFiles(files, bucketName);
      }

      this.handleUploadResults(zone, results);

    } catch (error) {
      console.error('Drop zone error:', error);
      this.showUploadError(zone, error.message);
    }
  }

  // ===================
  // UI HELPERS
  // ===================

  /**
   * Show upload progress
   */
  showUploadProgress(element, fileCount) {
    const existingProgress = element.parentNode.querySelector('.upload-progress');
    if (existingProgress) existingProgress.remove();

    const progressEl = document.createElement('div');
    progressEl.className = 'upload-progress';
    progressEl.innerHTML = `
      <div style="padding: 1rem; background: #f3f4f6; border-radius: 0.5rem; margin-top: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; color: #6b7280;">
          <div class="loading-spinner"></div>
          <span>Uploading ${fileCount} file${fileCount > 1 ? 's' : ''}...</span>
        </div>
      </div>
    `;
    
    element.parentNode.appendChild(progressEl);
  }

  /**
   * Handle upload results
   */
  handleUploadResults(element, results) {
    // Remove progress indicator
    const progressEl = element.parentNode.querySelector('.upload-progress');
    if (progressEl) progressEl.remove();

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    if (successful.length > 0) {
      this.showUploadSuccess(element, successful);
      
      // Trigger custom event
      element.dispatchEvent(new CustomEvent('upload-success', {
        detail: { results: successful }
      }));
    }

    if (failed.length > 0) {
      this.showUploadError(element, `${failed.length} file${failed.length > 1 ? 's' : ''} failed to upload`);
      
      // Trigger custom event
      element.dispatchEvent(new CustomEvent('upload-error', {
        detail: { results: failed }
      }));
    }
  }

  /**
   * Show upload success message
   */
  showUploadSuccess(element, results) {
    const successEl = document.createElement('div');
    successEl.className = 'upload-success';
    successEl.innerHTML = `
      <div style="padding: 0.75rem; background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; border-radius: 0.5rem; margin-top: 0.5rem; font-size: 0.875rem;">
        <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
        Successfully uploaded ${results.length} file${results.length > 1 ? 's' : ''}
      </div>
    `;
    
    element.parentNode.appendChild(successEl);
    
    // Auto-remove after 5 seconds
    setTimeout(() => successEl.remove(), 5000);
  }

  /**
   * Show upload error message
   */
  showUploadError(element, message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'upload-error';
    errorEl.innerHTML = `
      <div style="padding: 0.75rem; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: 0.5rem; margin-top: 0.5rem; font-size: 0.875rem;">
        <i class="fas fa-exclamation-circle" style="margin-right: 0.5rem;"></i>
        ${message}
      </div>
    `;
    
    element.parentNode.appendChild(errorEl);
    
    // Auto-remove after 8 seconds
    setTimeout(() => errorEl.remove(), 8000);
  }

  // ===================
  // UTILITY METHODS
  // ===================

  /**
   * Validate file before upload
   */
  validateFile(file, options = {}) {
    // Check file size
    if (options.maxSize && file.size > options.maxSize) {
      throw new Error(`File "${file.name}" is too large. Maximum size is ${this.formatFileSize(options.maxSize)}`);
    }

    // Check file type
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      throw new Error(`File type "${file.type}" is not allowed for "${file.name}"`);
    }

    return true;
  }

  /**
   * Generate unique filename
   */
  generateFileName(file) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = this.getFileExtension(file);
    return `${timestamp}-${random}.${extension}`;
  }

  /**
   * Get file extension
   */
  getFileExtension(file) {
    return file.name.split('.').pop().toLowerCase();
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Check if service is initialized
   */
  isInitialized() {
    return this.initialized;
  }

  // ===================
  // ADVANCED STORAGE OPERATIONS
  // ===================

  /**
   * List files in a bucket
   */
  async listFiles(bucketName, path = '', limit = 100) {
    try {
      const bucket = this.buckets[bucketName] || bucketName;
      const { data, error } = await this.client.storage
        .from(bucket)
        .list(path, {
          limit: limit,
          offset: 0
        });

      if (error) throw error;

      return {
        success: true,
        data: data.map(file => ({
          ...file,
          publicUrl: this.getPublicUrl(bucketName, `${path}${path ? '/' : ''}${file.name}`)
        }))
      };
    } catch (error) {
      console.error('List files error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Copy a file to another location
   */
  async copyFile(bucketName, fromPath, toPath) {
    try {
      const bucket = this.buckets[bucketName] || bucketName;
      const { data, error } = await this.client.storage
        .from(bucket)
        .copy(fromPath, toPath);

      if (error) throw error;

      return {
        success: true,
        data: {
          path: data.path,
          publicUrl: this.getPublicUrl(bucketName, toPath)
        }
      };
    } catch (error) {
      console.error('Copy file error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Move a file to another location
   */
  async moveFile(bucketName, fromPath, toPath) {
    try {
      const bucket = this.buckets[bucketName] || bucketName;
      const { data, error } = await this.client.storage
        .from(bucket)
        .move(fromPath, toPath);

      if (error) throw error;

      return {
        success: true,
        data: {
          path: data.path,
          publicUrl: this.getPublicUrl(bucketName, toPath)
        }
      };
    } catch (error) {
      console.error('Move file error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get file metadata
   */
  async getFileInfo(bucketName, fileName) {
    try {
      // Note: Supabase doesn't have a direct getFileInfo method
      // This is a workaround using list with the specific file
      const bucket = this.buckets[bucketName] || bucketName;
      const pathParts = fileName.split('/');
      const fileNameOnly = pathParts.pop();
      const path = pathParts.join('/');

      const { data, error } = await this.client.storage
        .from(bucket)
        .list(path, {
          search: fileNameOnly
        });

      if (error) throw error;

      const file = data.find(f => f.name === fileNameOnly);
      if (!file) {
        throw new Error('File not found');
      }

      return {
        success: true,
        data: {
          ...file,
          publicUrl: this.getPublicUrl(bucketName, fileName),
          fullPath: `${bucket}/${fileName}`
        }
      };
    } catch (error) {
      console.error('Get file info error:', error);
      return { success: false, error: error.message };
    }
  }

  // ===================
  // IMAGE PROCESSING
  // ===================

  /**
   * Resize image before upload (client-side)
   */
  async resizeImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.9) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        resolve(file); // Return original if not an image
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(resizedFile);
          },
          file.type,
          quality
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Generate thumbnail for image
   */
  async generateThumbnail(file, size = 300) {
    return await this.resizeImage(file, size, size, 0.8);
  }

  /**
   * Convert image to WebP format (if supported)
   */
  async convertToWebP(file, quality = 0.9) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/') || file.type === 'image/webp') {
        resolve(file);
        return;
      }

      // Check if browser supports WebP
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!canvas.toDataURL('image/webp').startsWith('data:image/webp')) {
        resolve(file); // WebP not supported
        return;
      }

      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
              type: 'image/webp',
              lastModified: Date.now()
            });
            resolve(webpFile);
          },
          'image/webp',
          quality
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  // ===================
  // BATCH OPERATIONS
  // ===================

  /**
   * Upload multiple files with progress tracking
   */
  async uploadFilesWithProgress(files, bucketName, options = {}, progressCallback = null) {
    const results = [];
    let completed = 0;
    
    for (const file of files) {
      try {
        const result = await this.uploadFile(file, bucketName, null, options);
        results.push({
          file: file.name,
          ...result
        });
        
        completed++;
        
        if (progressCallback) {
          progressCallback({
            completed,
            total: files.length,
            progress: Math.round((completed / files.length) * 100),
            currentFile: file.name,
            result
          });
        }
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        results.push({
          file: file.name,
          success: false,
          error: error.message
        });
        completed++;
        
        if (progressCallback) {
          progressCallback({
            completed,
            total: files.length,
            progress: Math.round((completed / files.length) * 100),
            currentFile: file.name,
            result: { success: false, error: error.message }
          });
        }
      }
    }

    return results;
  }

  /**
   * Delete multiple files
   */
  async deleteFiles(bucketName, fileNames) {
    try {
      const bucket = this.buckets[bucketName] || bucketName;
      const { error } = await this.client.storage
        .from(bucket)
        .remove(fileNames);

      if (error) throw error;

      return { success: true, deletedCount: fileNames.length };
    } catch (error) {
      console.error('Delete files error:', error);
      return { success: false, error: error.message };
    }
  }

  // ===================
  // STORAGE ANALYTICS
  // ===================

  /**
   * Get storage usage statistics
   */
  async getStorageStats() {
    try {
      const stats = {};
      
      for (const [key, bucket] of Object.entries(this.buckets)) {
        const { data } = await this.listFiles(key);
        if (data) {
          stats[key] = {
            fileCount: data.length,
            totalSize: data.reduce((sum, file) => sum + (file.metadata?.size || 0), 0)
          };
        }
      }

      return { success: true, data: stats };
    } catch (error) {
      console.error('Storage stats error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Clean up old files (older than specified days)
   */
  async cleanupOldFiles(bucketName, daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const { data: files } = await this.listFiles(bucketName);
      if (!files) return { success: true, deletedCount: 0 };

      const oldFiles = files.filter(file => 
        new Date(file.created_at) < cutoffDate
      );

      if (oldFiles.length === 0) {
        return { success: true, deletedCount: 0 };
      }

      const filePaths = oldFiles.map(file => file.name);
      const result = await this.deleteFiles(bucketName, filePaths);

      return {
        success: result.success,
        deletedCount: result.success ? oldFiles.length : 0,
        error: result.error
      };
    } catch (error) {
      console.error('Cleanup error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create global instance
const storageService = new StorageService();

// Initialize when Supabase client is ready
document.addEventListener('DOMContentLoaded', async () => {
  const checkClient = setInterval(() => {
    if (supabaseClient && supabaseClient.isInitialized()) {
      storageService.init(supabaseClient);
      clearInterval(checkClient);
    }
  }, 100);
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StorageService, storageService };
}