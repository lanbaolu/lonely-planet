import type { CacheData } from '@/types';

const CACHE_KEY_PREFIX = 'solo-planet-';
const CACHE_VERSION = 'v1';
const CACHE_DURATION = 2 * 60 * 60 * 1000;

export function getCache(key: string): CacheData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY_PREFIX + key);
    if (!raw) return null;
    const data: CacheData = JSON.parse(raw);
    if (data.version !== CACHE_VERSION) return null;
    if (Date.now() - data.timestamp > CACHE_DURATION) return null;
    return data;
  } catch {
    return null;
  }
}

export function setCache(key: string, projects: CacheData['projects']): void {
  try {
    const data: CacheData = {
      projects,
      timestamp: Date.now(),
      version: CACHE_VERSION,
    };
    localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(data));
  } catch {
  }
}

export function getCacheTimestamp(key: string): number | null {
  const cache = getCache(key);
  return cache ? cache.timestamp : null;
}
