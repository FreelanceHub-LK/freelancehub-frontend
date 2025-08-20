// Backend API configuration and endpoint mapping
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  
  // API endpoints based on actual backend implementation
  ENDPOINTS: {
    // Users module endpoints (handles freelancers and clients)
    USERS: '/users',
    USER_BY_ID: (id: string) => `/users/${id}`,
    USER_BY_EMAIL: (email: string) => `/users/email/${email}`,
    
    // Skills module endpoints
    SKILLS: '/skills',
    SKILLS_POPULAR: '/skills/popular',
    SKILLS_SEARCH: '/skills/search',
    SKILL_BY_ID: (id: string) => `/skills/${id}`,
    
    // Reviews module endpoints
    REVIEWS: '/reviews',
    REVIEW_STATS: (userId: string) => `/reviews/stats/${userId}`,
    
    // Categories module endpoints (if available)
    CATEGORIES: '/categories',
    
    // Auth endpoints
    AUTH_LOGIN: '/auth/login',
    AUTH_REGISTER: '/auth/register',
    AUTH_REFRESH: '/auth/refresh',
    
    // Projects module endpoints (if available)
    PROJECTS: '/projects',
    PROJECT_BY_ID: (id: string) => `/projects/${id}`,
    
    // Messages module endpoints (if available)
    MESSAGES: '/messages',
    
    // File upload endpoints (if available)
    FILE_UPLOAD: '/file-upload',
  },
  
  // Default query parameters
  DEFAULT_PARAMS: {
    PAGE: 1,
    LIMIT: 10,
    ROLE_FREELANCER: 'freelancer',
    ROLE_CLIENT: 'client',
  },
  
  // API response field mappings
  FIELD_MAPPINGS: {
    // Backend uses _id, frontend expects id
    ID_FIELD: '_id',
    
    // User fields
    USER_FIELDS: {
      id: '_id',
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      profilePicture: 'profilePicture',
      phoneNumber: 'phoneNumber',
      address: 'address',
      bio: 'bio',
      rating: 'rating',
      reviewCount: 'reviewCount',
      role: 'role',
      status: 'status',
      emailVerified: 'emailVerified',
      phoneVerified: 'phoneVerified',
      lastLogin: 'lastLogin',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    
    // Skill fields
    SKILL_FIELDS: {
      id: '_id',
      name: 'name',
      description: 'description',
      category: 'category',
      popularity: 'popularity',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
  
  // Error messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access forbidden.',
    NOT_FOUND: 'Requested resource not found.',
    SERVER_ERROR: 'Internal server error. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
  },
};

// Helper function to build query parameters
export const buildQueryParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });
  
  return searchParams.toString();
};

// Helper function to handle API errors
export const handleApiError = (error: any): string => {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message;
    
    switch (status) {
      case 400:
        return message || API_CONFIG.ERROR_MESSAGES.VALIDATION_ERROR;
      case 401:
        return API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return API_CONFIG.ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return API_CONFIG.ERROR_MESSAGES.NOT_FOUND;
      case 500:
        return API_CONFIG.ERROR_MESSAGES.SERVER_ERROR;
      default:
        return message || 'An unexpected error occurred.';
    }
  } else if (error.request) {
    return API_CONFIG.ERROR_MESSAGES.NETWORK_ERROR;
  } else {
    return error.message || 'An unexpected error occurred.';
  }
};

export default API_CONFIG;
