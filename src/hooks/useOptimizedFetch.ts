'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { cache, cacheKeys } from '../lib/cache';

interface UseOptimizedFetchOptions<T> {
  cacheKey?: string;
  cacheTTL?: number;
  refetchOnWindowFocus?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

interface UseOptimizedFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  mutate: (updater: (prev: T | null) => T | null) => void;
}

export function useOptimizedFetch<T>(
  fetchFn: () => Promise<T>,
  options: UseOptimizedFetchOptions<T> = {}
): UseOptimizedFetchResult<T> {
  const {
    cacheKey,
    cacheTTL = 5 * 60 * 1000, // 5 minutes default
    refetchOnWindowFocus = false,
    retryAttempts = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
    enabled = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (isRetry = false) => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    // Check cache first
    if (cacheKey && !isRetry) {
      const cachedData = cache.get<T>(cacheKey);
      if (cachedData !== null) {
        setData(cachedData);
        setLoading(false);
        onSuccess?.(cachedData);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const result = await fetchFn();
      
      // Cache the result
      if (cacheKey) {
        cache.set(cacheKey, result, cacheTTL);
      }

      setData(result);
      setError(null);
      retryCountRef.current = 0;
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      
      if (retryCountRef.current < retryAttempts) {
        retryCountRef.current++;
        setTimeout(() => fetchData(true), retryDelay * retryCountRef.current);
        return;
      }

      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, cacheKey, cacheTTL, retryAttempts, retryDelay, onSuccess, onError, enabled]);

  const refetch = useCallback(async () => {
    // Clear cache for this key
    if (cacheKey) {
      cache.delete(cacheKey);
    }
    retryCountRef.current = 0;
    await fetchData();
  }, [fetchData, cacheKey]);

  const mutate = useCallback((updater: (prev: T | null) => T | null) => {
    setData(prev => {
      const newData = updater(prev);
      
      // Update cache if we have a cache key and new data
      if (cacheKey && newData !== null) {
        cache.set(cacheKey, newData, cacheTTL);
      }
      
      return newData;
    });
  }, [cacheKey, cacheTTL]);

  // Initial fetch
  useEffect(() => {
    fetchData();
    
    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Refetch on window focus
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (!document.hidden) {
        refetch();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetch, refetchOnWindowFocus]);

  return {
    data,
    loading,
    error,
    refetch,
    mutate,
  };
}

// Specialized hooks for common use cases
export function useProfileData(userId: string) {
  return useOptimizedFetch(
    async () => {
      const { authApi } = await import('../lib/api/auth');
      return authApi.getProfile();
    },
    {
      cacheKey: cacheKeys.profile(userId),
      cacheTTL: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
    }
  );
}

export function useProjectsData(userId: string, filters?: any) {
  return useOptimizedFetch(
    async () => {
      const { projectApi } = await import('../lib/api/projects');
      return projectApi.getProjects(filters);
    },
    {
      cacheKey: cacheKeys.projects(userId, filters),
      cacheTTL: 3 * 60 * 1000, // 3 minutes
    }
  );
}

export function useCategoriesData() {
  return useOptimizedFetch(
    async () => {
      const { categoryApi } = await import('../lib/api/categories');
      return categoryApi.getCategories();
    },
    {
      cacheKey: cacheKeys.categories(),
      cacheTTL: 30 * 60 * 1000, // 30 minutes - categories don't change often
    }
  );
}
