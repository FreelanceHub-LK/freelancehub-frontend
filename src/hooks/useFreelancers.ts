import { useState, useEffect } from 'react';
import { freelancerApi, FreelancerProfile, FreelancerFilters, FreelancerListResponse } from '../lib/api/freelancer';
import { skillsApi, Skill } from '../lib/api/skills';
import { adaptFreelancerList, adaptFreelancerProfile } from '../lib/adapters/freelancerAdapter';
import { toast } from '../context/toast-context';

// Hook for fetching freelancers with pagination and filtering
export const useFreelancers = (initialFilters: FreelancerFilters = {}) => {
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FreelancerFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 0
  });

  const fetchFreelancers = async (newFilters?: FreelancerFilters) => {
    try {
      setLoading(true);
      setError(null);
      const currentFilters = newFilters || filters;
      const response: FreelancerListResponse = await freelancerApi.getFreelancers(currentFilters);
      
      // Use adapter to transform data
      const adaptedFreelancers = adaptFreelancerList(response.users || []);
      setFreelancers(adaptedFreelancers as any);
      setPagination({
        total: response.total || 0,
        page: response.page || 1,
        totalPages: response.totalPages || 1
      });
    } catch (err) {
      setError('Failed to fetch freelancers');
      toast.error('Failed to load freelancers');
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<FreelancerFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    fetchFreelancers(updatedFilters);
  };

  const loadMore = async () => {
    const nextPage = pagination.page + 1;
    if (nextPage <= pagination.totalPages) {
      try {
        setLoading(true);
        const newFilters = { ...filters, page: nextPage };
        const response: FreelancerListResponse = await freelancerApi.getFreelancers(newFilters);
        
        const adaptedFreelancers = adaptFreelancerList(response.users || []);
        setFreelancers(prev => [...prev, ...adaptedFreelancers as any]);
        setPagination({
          total: response.total || 0,
          page: response.page || nextPage,
          totalPages: response.totalPages || 1
        });
        setFilters(newFilters);
      } catch (err) {
        toast.error('Failed to load more freelancers');
      } finally {
        setLoading(false);
      }
    }
  };

  const refresh = () => {
    fetchFreelancers();
  };

  useEffect(() => {
    fetchFreelancers();
  }, []);

  return {
    freelancers,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    loadMore,
    refresh
  };
};

// Hook for fetching a single freelancer
export const useFreelancer = (id: string) => {
  const [freelancer, setFreelancer] = useState<FreelancerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFreelancer = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await freelancerApi.getFreelancer(id);
        const adaptedData = adaptFreelancerProfile(data);
        setFreelancer(adaptedData as any);
      } catch (err) {
        setError('Failed to fetch freelancer details');
        toast.error('Failed to load freelancer profile');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFreelancer();
    }
  }, [id]);

  return { freelancer, loading, error };
};

// Hook for freelancer search
export const useFreelancerSearch = () => {
  const [results, setResults] = useState<FreelancerProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string, filters: FreelancerFilters = {}) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await freelancerApi.searchFreelancers(query, filters);
      const adaptedResults = adaptFreelancerList(response.users || []);
      setResults(adaptedResults as any);
    } catch (err) {
      setError('Failed to search freelancers');
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return { results, loading, error, search, clearResults };
};

// Hook for skills management
export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [popularSkills, setPopularSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [allSkills, popular] = await Promise.all([
          skillsApi.getAllSkills(),
          skillsApi.getPopularSkills(20)
        ]);

        setSkills(allSkills);
        setPopularSkills(popular);
        
        // Try to fetch categories, but don't fail if not available
        try {
          const cats = await skillsApi.getCategories();
          setCategories(cats);
        } catch (catErr) {
          console.warn('Categories not available:', catErr);
          setCategories([]);
        }
      } catch (err) {
        setError('Failed to fetch skills data');
        toast.error('Failed to load skills');
      } finally {
        setLoading(false);
      }
    };

    fetchSkillsData();
  }, []);

  const searchSkills = async (query: string): Promise<Skill[]> => {
    try {
      return await skillsApi.searchSkills(query);
    } catch (err) {
      toast.error('Failed to search skills');
      return [];
    }
  };

  return {
    skills,
    popularSkills,
    categories,
    loading,
    error,
    searchSkills
  };
};

// Hook for freelancer reviews
export const useFreelancerReviews = (freelancerId: string) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [reviewsData, statsData] = await Promise.all([
          freelancerApi.getFreelancerReviews(freelancerId),
          freelancerApi.getFreelancerReviewStats(freelancerId)
        ]);

        setReviews((reviewsData as any).reviews || []);
        setStats(statsData);
      } catch (err) {
        setError('Failed to fetch reviews');
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    if (freelancerId) {
      fetchReviews();
    }
  }, [freelancerId]);

  return { reviews, stats, loading, error };
};

// Hook for featured freelancers
export const useFeaturedFreelancers = (limit = 8) => {
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await freelancerApi.getFeaturedFreelancers(limit);
        setFreelancers(data);
      } catch (err) {
        setError('Failed to fetch featured freelancers');
        toast.error('Failed to load featured freelancers');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [limit]);

  return { freelancers, loading, error };
};

// Hook for similar freelancers
export const useSimilarFreelancers = (freelancerId: string, limit = 4) => {
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await freelancerApi.getSimilarFreelancers(freelancerId, limit);
        setFreelancers(data);
      } catch (err) {
        setError('Failed to fetch similar freelancers');
        toast.error('Failed to load similar freelancers');
      } finally {
        setLoading(false);
      }
    };

    if (freelancerId) {
      fetchSimilar();
    }
  }, [freelancerId, limit]);

  return { freelancers, loading, error };
};
