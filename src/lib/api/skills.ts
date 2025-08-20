import apiClient from "../../api/axios-instance";

export interface Skill {
  _id: string;
  name: string;
  description?: string;
  category?: string; // ObjectId reference to Category
  popularity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSkillDto {
  name: string;
  description?: string;
  category?: string;
}

export interface UpdateSkillDto extends Partial<CreateSkillDto> {}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const skillsApi = {
  // Get all skills
  getAllSkills: async (): Promise<Skill[]> => {
    const response = await apiClient.get('/skills');
    return response.data as Skill[];
  },

  // Get popular skills
  getPopularSkills: async (limit?: number): Promise<Skill[]> => {
    const url = limit ? `/skills/popular?limit=${limit}` : '/skills/popular';
    const response = await apiClient.get(url);
    return response.data as Skill[];
  },

  // Search skills by name
  searchSkills: async (name: string): Promise<Skill[]> => {
    const response = await apiClient.get(`/skills/search?name=${encodeURIComponent(name)}`);
    return response.data as Skill[];
  },

  // Get skill by ID
  getSkill: async (id: string): Promise<Skill> => {
    const response = await apiClient.get(`/skills/${id}`);
    return response.data as Skill;
  },

  // Create skill (admin only)
  createSkill: async (data: CreateSkillDto): Promise<Skill> => {
    const response = await apiClient.post('/skills', data);
    return response.data as Skill;
  },

  // Update skill (admin only)
  updateSkill: async (id: string, data: UpdateSkillDto): Promise<Skill> => {
    const response = await apiClient.patch(`/skills/${id}`, data);
    return response.data as Skill;
  },

  // Delete skill (admin only)
  deleteSkill: async (id: string): Promise<void> => {
    await apiClient.delete(`/skills/${id}`);
  },

  // Get skills by category
  getSkillsByCategory: async (categoryId: string): Promise<Skill[]> => {
    const response = await apiClient.get(`/skills?category=${categoryId}`);
    return response.data as Skill[];
  },

  // Get categories (placeholder - might need separate categories API)
  getCategories: async (): Promise<Category[]> => {
    // This might need to be implemented in backend as separate endpoint
    const response = await apiClient.get('/categories');
    return response.data as Category[];
  }
};
