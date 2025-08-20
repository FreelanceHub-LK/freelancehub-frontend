// Simple in-memory cache with TTL
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class Cache {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const isExpired = Date.now() - item.timestamp > item.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Get cached data or execute function and cache result
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    const cached = this.get<T>(key);
    
    if (cached !== null) {
      return cached;
    }

    const data = await fetchFn();
    this.set(key, data, ttl);
    return data;
  }
}

// Export singleton instance
export const cache = new Cache();

// Cache key generators
export const cacheKeys = {
  profile: (userId: string) => `profile:${userId}`,
  projects: (userId: string, filters?: any) => 
    `projects:${userId}:${JSON.stringify(filters || {})}`,
  proposals: (userId: string) => `proposals:${userId}`,
  contracts: (userId: string) => `contracts:${userId}`,
  messages: (userId: string) => `messages:${userId}`,
  reviews: (userId: string) => `reviews:${userId}`,
  notifications: (userId: string) => `notifications:${userId}`,
  categories: () => 'categories',
  skills: () => 'skills',
  analytics: (userId: string, timeframe: string) => 
    `analytics:${userId}:${timeframe}`,
};
