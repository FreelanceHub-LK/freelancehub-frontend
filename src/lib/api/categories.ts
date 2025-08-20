import apiClient from "../../api/axios-instance";

export interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Populated fields
  parent?: Category;
  children?: Category[];
  projectCount?: number;
}

export interface CreateCategoryDto {
  name: string;
  description: string;
  parentId?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export interface CategoryFilters {
  parentId?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'sortOrder' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CategoryListResponse {
  categories: Category[];
  total: number;
  page: number;
  totalPages: number;
}

export const categoryApi = {
  // Get all categories with filters
  getCategories: async (filters: CategoryFilters = {}): Promise<CategoryListResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/categories?${params.toString()}`);
    return (response.data as any).data;
  },

  // Get category by ID
  getCategory: async (id: string): Promise<{ success: boolean; data: Category }> => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data as { success: boolean; data: Category };
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string): Promise<{ success: boolean; data: Category }> => {
    const response = await apiClient.get(`/categories/slug/${slug}`);
    return response.data as { success: boolean; data: Category };
  },

  // Create new category (admin only)
  createCategory: async (categoryDto: CreateCategoryDto): Promise<{ success: boolean; data: Category }> => {
    const response = await apiClient.post('/categories', categoryDto);
    return response.data as { success: boolean; data: Category };
  },

  // Update category (admin only)
  updateCategory: async (id: string, updateDto: UpdateCategoryDto): Promise<{ success: boolean; data: Category }> => {
    const response = await apiClient.patch(`/categories/${id}`, updateDto);
    return response.data as { success: boolean; data: Category };
  },

  // Delete category (admin only)
  deleteCategory: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data as { success: boolean; message: string };
  },

  // Get main categories (top level)
  getMainCategories: async (): Promise<{ success: boolean; data: Category[] }> => {
    const response = await apiClient.get('/categories/main');
    return response.data as { success: boolean; data: Category[] };
  },

  // Get category tree (hierarchical structure)
  getCategoryTree: async (): Promise<{ success: boolean; data: Category[] }> => {
    const response = await apiClient.get('/categories/tree');
    return response.data as { success: boolean; data: Category[] };
  },

  // Get popular categories
  getPopularCategories: async (limit?: number): Promise<{ success: boolean; data: Category[] }> => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await apiClient.get(`/categories/popular${params}`);
    return response.data as { success: boolean; data: Category[] };
  },
};
