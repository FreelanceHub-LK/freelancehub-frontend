// Export all API modules
export * from './auth';
export * from './freelancer';
export * from './projects';
export * from './proposals';
export * from './contracts';
export * from './payments';
export * from './messages';
export * from './reviews';
export * from './notifications';
export { categoryApi, type Category as CategoryType, type CreateCategoryDto, type UpdateCategoryDto, type CategoryFilters, type CategoryListResponse } from './categories';
export { skillsApi, type Skill, type CreateSkillDto, type UpdateSkillDto } from './skills';
export * from './analytics';

// Import all APIs for easy access
import { authApi } from './auth';
import { freelancerApi } from './freelancer';
import { projectApi } from './projects';
import { proposalApi } from './proposals';
import { contractApi } from './contracts';
import { paymentApi } from './payments';
import { messageApi } from './messages';
import { reviewApi } from './reviews';
import { notificationApi } from './notifications';
import { categoryApi } from './categories';
import { skillsApi } from './skills';
import { analyticsApi } from './analytics';

// Consolidated API object
export const api = {
  auth: authApi,
  freelancers: freelancerApi,
  projects: projectApi,
  proposals: proposalApi,
  contracts: contractApi,
  payments: paymentApi,
  messages: messageApi,
  reviews: reviewApi,
  notifications: notificationApi,
  categories: categoryApi,
  skills: skillsApi,
  analytics: analyticsApi,
};

export default api;
