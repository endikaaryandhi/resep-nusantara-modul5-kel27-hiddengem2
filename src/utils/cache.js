// src/utils/cache.js

/**
 * Simple in-memory cache with Time-to-Live (TTL)
 */
class SimpleCache {
  constructor(defaultTtl = 5 * 60 * 1000) { // Default 5 menit TTL
    this.cache = new Map();
    this.defaultTtl = defaultTtl;
  }

  /**
   * Get a value from the cache
   * @param {string} key
   * @returns {*} Cached data or undefined
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) {
      return undefined;
    }

    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  /**
   * Set a value in the cache
   * @param {string} key
   * @param {*} value
   * @param {number} [ttl=this.defaultTtl] - TTL in milliseconds
   */
  set(key, value, ttl = this.defaultTtl) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Delete a value from the cache
   * @param {string} key
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Clear the entire cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Invalidate cache for a specific group (e.g., all 'recipes')
   * @param {string} prefix - Key prefix (e.g., 'recipes_')
   */
  invalidatePrefix(prefix) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }
}

// Ekspor instance singleton
export const apiCache = new SimpleCache();