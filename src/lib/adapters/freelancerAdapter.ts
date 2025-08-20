import { FreelancerProfile } from '../api/freelancer';

// Adapter function to transform backend FreelancerProfile to frontend interface
export const adaptFreelancerProfile = (freelancer: FreelancerProfile) => {
  return {
    // Map _id to id for frontend components
    id: freelancer._id,
    name: `${freelancer.firstName} ${freelancer.lastName}`,
    title: freelancer.bio || 'Freelancer', // Use bio as title for now
    hourlyRate: freelancer.hourlyRate || 0,
    rating: freelancer.rating || 0,
    reviews: freelancer.reviewCount || 0,
    skills: freelancer.skills || [],
    location: freelancer.address || '',
    about: freelancer.bio || '',
    imageUrl: freelancer.profilePicture || '/api/placeholder/150/150',
    completedProjects: freelancer.completedProjects || 0,
    isAvailable: freelancer.isAvailable || false,
    memberSince: freelancer.createdAt ? new Date(freelancer.createdAt).toISOString() : '',
    responseTime: '2 hours', // Default value since not in backend
    languages: ['English'], // Default value since not in backend
    isVerified: freelancer.emailVerified || false,
    isOnline: freelancer.status === 'active',
    
    // Additional fields for detailed views
    email: freelancer.email,
    firstName: freelancer.firstName,
    lastName: freelancer.lastName,
    profilePicture: freelancer.profilePicture,
    phoneNumber: freelancer.phoneNumber,
    address: freelancer.address,
    bio: freelancer.bio,
    reviewCount: freelancer.reviewCount,
    role: freelancer.role,
    status: freelancer.status,
    emailVerified: freelancer.emailVerified,
    phoneVerified: freelancer.phoneVerified,
    lastLogin: freelancer.lastLogin,
    createdAt: freelancer.createdAt,
    updatedAt: freelancer.updatedAt,
    education: freelancer.education,
    certifications: freelancer.certifications,
    portfolioLinks: freelancer.portfolioLinks,
  };
};

// Adapter for multiple freelancers
export const adaptFreelancerList = (freelancers: FreelancerProfile[]) => {
  return freelancers.map(adaptFreelancerProfile);
};

// Reverse adapter for creating/updating freelancer profiles
export const adaptToBackendProfile = (frontendData: any): Partial<FreelancerProfile> => {
  return {
    firstName: frontendData.firstName || frontendData.name?.split(' ')[0] || '',
    lastName: frontendData.lastName || frontendData.name?.split(' ').slice(1).join(' ') || '',
    email: frontendData.email,
    profilePicture: frontendData.profilePicture || frontendData.imageUrl,
    phoneNumber: frontendData.phoneNumber,
    address: frontendData.address || frontendData.location,
    bio: frontendData.bio || frontendData.about,
    skills: frontendData.skills,
    hourlyRate: frontendData.hourlyRate,
    education: frontendData.education,
    isAvailable: frontendData.isAvailable,
    certifications: frontendData.certifications,
    portfolioLinks: frontendData.portfolioLinks,
  };
};
