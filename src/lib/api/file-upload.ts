import apiClient from "../../api/axios-instance";

export interface FileUploadResponse {
  success: boolean;
  data: {
    filename: string;
    originalName: string;
    url: string;
    size: number;
    mimeType: string;
    uploadedAt: Date;
  };
  message: string;
}

export interface MultipleFileUploadResponse {
  success: boolean;
  data: {
    filename: string;
    originalName: string;
    url: string;
    size: number;
    mimeType: string;
    uploadedAt: Date;
  }[];
  message: string;
}

export interface FileInfo {
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  uploadedBy: string;
  folder?: string;
}

export interface PresignedUrlResponse {
  success: boolean;
  data: {
    uploadUrl: string;
    fields: Record<string, string>;
    fileUrl: string;
  };
  message: string;
}

export interface FileListResponse {
  success: boolean;
  data: FileInfo[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FileFilters {
  folder?: string;
  mimeType?: string;
  uploadedBy?: string;
  minSize?: number;
  maxSize?: number;
  uploadedAfter?: string;
  uploadedBefore?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const fileUploadApi = {
  // Upload single file
  uploadSingle: async (file: File, folder?: string): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await apiClient.post('/file-upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data as FileUploadResponse;
  },

  // Upload multiple files
  uploadMultiple: async (files: File[], folder?: string): Promise<MultipleFileUploadResponse> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await apiClient.post('/file-upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data as MultipleFileUploadResponse;
  },

  // Get presigned URL for direct upload to S3
  getPresignedUrl: async (filename: string, mimeType: string, folder?: string): Promise<PresignedUrlResponse> => {
    const params = new URLSearchParams({
      filename,
      mimeType,
    });
    if (folder) {
      params.append('folder', folder);
    }

    const response = await apiClient.get(`/file-upload/presigned-url?${params.toString()}`);
    return response.data as PresignedUrlResponse;
  },

  // Upload using presigned URL
  uploadWithPresignedUrl: async (presignedUrl: string, fields: Record<string, string>, file: File): Promise<void> => {
    const formData = new FormData();
    
    // Add all the fields from the presigned URL
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    // Add the file last
    formData.append('file', file);

    // Upload directly to S3
    await fetch(presignedUrl, {
      method: 'POST',
      body: formData,
    });
  },

  // Delete file
  deleteFile: async (filename: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/file-upload/${encodeURIComponent(filename)}`);
    return response.data as { success: boolean; message: string };
  },

  // Get file info
  getFileInfo: async (filename: string): Promise<{ success: boolean; data: FileInfo }> => {
    const response = await apiClient.get(`/file-upload/${encodeURIComponent(filename)}`);
    return response.data as { success: boolean; data: FileInfo };
  },

  // List user files
  getUserFiles: async (filters: FileFilters = {}): Promise<FileListResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/file-upload/my-files?${params.toString()}`);
    return response.data as FileListResponse;
  },

  // List files in folder
  getFolderFiles: async (folder: string, filters: Omit<FileFilters, 'folder'> = {}): Promise<FileListResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/file-upload/folder/${encodeURIComponent(folder)}?${params.toString()}`);
    return response.data as FileListResponse;
  },

  // Generate download URL
  getDownloadUrl: async (filename: string): Promise<{ success: boolean; data: { downloadUrl: string } }> => {
    const response = await apiClient.get(`/file-upload/download-url/${encodeURIComponent(filename)}`);
    return response.data as { success: boolean; data: { downloadUrl: string } };
  },

  // Validate file
  validateFile: (file: File, options?: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  }): { valid: boolean; error?: string } => {
    const maxSize = options?.maxSize || parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760'); // 10MB default
    const allowedTypes = options?.allowedTypes || ['image/*', 'application/pdf', '.doc', '.docx'];
    
    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
      };
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidType = allowedTypes.some(type => {
      if (type.includes('*')) {
        return file.type.startsWith(type.replace('*', ''));
      }
      if (type.startsWith('.')) {
        return fileExtension === type;
      }
      return file.type === type;
    });

    if (!isValidType) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    return { valid: true };
  },

  // Format file size
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Get file icon based on type
  getFileIcon: (mimeType: string | undefined): string => {
    if (!mimeType) return '📄';
    
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.includes('document') || mimeType.includes('word')) return '📝';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📽️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('zip') || mimeType.includes('archive')) return '🗜️';
    
    return '📄';
  },
};
