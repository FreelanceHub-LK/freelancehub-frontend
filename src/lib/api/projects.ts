import apiClient from "../../api/axios-instance";

export interface Project {
  _id: string;
  title: string;
  description: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  deadline: Date;
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
  clientId: string;
  freelancerId?: string;
  categoryId: string;
  skillsRequired: string[];
  attachments?: string[];
  isUrgent: boolean;
  createdAt: Date;
  updatedAt: Date;
  client?: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    rating: number;
  };
  category?: {
    _id: string;
    name: string;
  };
  proposalCount?: number;
}

export interface CreateProjectDto {
  title: string;
  description: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  deadline: string;
  categoryId: string;
  skillsRequired: string[];
  attachments?: string[];
  isUrgent?: boolean;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

export interface ProjectFilters {
  category?: string;
  skills?: string[];
  minBudget?: number;
  maxBudget?: number;
  status?: string;
  isUrgent?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'budget' | 'deadline';
  sortOrder?: 'asc' | 'desc';
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
  page: number;
  totalPages: number;
}

export const projectApi = {
  // Get all projects with filters
  getProjects: async (filters: ProjectFilters = {}): Promise<ProjectListResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => params.append(key, item.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await apiClient.get(`/projects?${params.toString()}`);
    return (response.data as any).data;
  },

  // Get project by ID
  getProject: async (id: string): Promise<{ success: boolean; data: Project }> => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data as { success: boolean; data: Project };
  },

  // Create new project
  createProject: async (projectDto: CreateProjectDto): Promise<{ success: boolean; data: Project }> => {
    const response = await apiClient.post('/projects', projectDto);
    return response.data as { success: boolean; data: Project };
  },

  // Update project
  updateProject: async (id: string, updateDto: UpdateProjectDto): Promise<{ success: boolean; data: Project }> => {
    const response = await apiClient.patch(`/projects/${id}`, updateDto);
    return response.data as { success: boolean; data: Project };
  },

  // Delete project
  deleteProject: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data as { success: boolean; message: string };
  },

  // Get my projects (client)
  getMyProjects: async (filters: ProjectFilters = {}): Promise<ProjectListResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => params.append(key, item.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await apiClient.get(`/projects/my?${params.toString()}`);
    return (response.data as any).data;
  },

  // Get featured projects
  getFeaturedProjects: async (): Promise<{ success: boolean; data: Project[] }> => {
    const response = await apiClient.get('/projects/featured');
    return response.data as { success: boolean; data: Project[] };
  },

  // Search projects
  searchProjects: async (query: string, filters: ProjectFilters = {}): Promise<ProjectListResponse> => {
    const params = new URLSearchParams({ search: query });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'search') {
        if (Array.isArray(value)) {
          value.forEach(item => params.append(key, item.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await apiClient.get(`/projects/search?${params.toString()}`);
    return (response.data as any).data;
  },
};
