/**
 * History Service for AdGen AI.
 * Handles LocalStorage persistence, synchronization, and error-tolerant retrieval.
 */

export const STORAGE_KEY = 'adgen_ai_history';

// In-memory fallback if LocalStorage is unavailable or restricted
let memoryStore = [];

/**
 * Check if window.localStorage is accessible and writable.
 * @returns {boolean}
 */
const isStorageAvailable = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const testKey = '__adgen_storage_probe__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Normalize and validate a single history record.
 * Ensures consistent structure regardless of whether captions/headlines are objects or strings.
 * @param {object} item
 * @returns {object}
 */
const normalizeHistoryItem = (item) => {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const id = item.id || `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const created_at = item.created_at || new Date().toISOString();

  // Extract captions, headlines, hashtags from top-level or result sub-object
  const rawCaptions = item.captions || item.result?.captions || [];
  const rawHeadlines = item.headlines || item.result?.headlines || [];
  const rawHashtags = item.hashtags || item.result?.hashtags || [];

  // Compute preview caption for quick listing
  let preview = item.preview_caption || '';
  if (!preview && rawCaptions.length > 0) {
    const firstCap = rawCaptions[0];
    preview = typeof firstCap === 'object' ? firstCap?.content || '' : String(firstCap);
  }

  return {
    id,
    product_name: String(item.product_name || 'Sản phẩm chưa đặt tên').trim(),
    description: String(item.description || '').trim(),
    target_audience: String(item.target_audience || '').trim(),
    tone: item.tone || 'youthful',
    model: item.model || 'gemini-3.5-flash',
    created_at,
    preview_caption: preview,
    captions: rawCaptions,
    headlines: rawHeadlines,
    hashtags: rawHashtags,
    result: {
      captions: rawCaptions,
      headlines: rawHeadlines,
      hashtags: rawHashtags,
    },
  };
};

/**
 * Retrieve all history records sorted by newest first.
 * Safely handles empty storage, corrupt JSON, or invalid schema.
 * @returns {Array<object>}
 */
export const getHistory = () => {
  if (!isStorageAvailable()) {
    return [...memoryStore].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw || !raw.trim()) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('[historyService] LocalStorage data is not an array, resetting to empty.');
      return [];
    }

    const validItems = parsed
      .map(normalizeHistoryItem)
      .filter(Boolean);

    // Sort newest first (descending by timestamp)
    return validItems.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    console.error('[historyService] Failed to parse history from LocalStorage:', error);
    // Never crash the app on corrupt JSON
    return [];
  }
};

/**
 * Save a newly generated content bundle to LocalStorage.
 * Inserts the record at the front of the list.
 * @param {object} item
 * @returns {object} The normalized saved item
 */
export const saveHistory = (item) => {
  const normalized = normalizeHistoryItem(item);
  if (!normalized) {
    throw new Error('Dữ liệu lưu lịch sử không hợp lệ.');
  }

  const currentHistory = getHistory();
  // Filter out any accidental duplicate with the same ID
  const updatedHistory = [normalized, ...currentHistory.filter((i) => i.id !== normalized.id)];

  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('[historyService] Failed to write to LocalStorage:', error);
      memoryStore = updatedHistory;
    }
  } else {
    memoryStore = updatedHistory;
  }

  return normalized;
};

/**
 * Retrieve a specific history item by its ID.
 * @param {string} id
 * @returns {object|null}
 */
export const getHistoryById = (id) => {
  if (!id) return null;
  const history = getHistory();
  return history.find((item) => item.id === id) || null;
};

/**
 * Update an existing history item in-place (e.g. after regenerating a single caption/headline).
 * Does not create duplicate entries or disturb other items.
 * @param {string} id
 * @param {object} updates
 * @returns {object|null} The updated item, or null if not found
 */
export const updateHistoryItem = (id, updates) => {
  if (!id || !updates || typeof updates !== 'object') {
    return null;
  }

  const currentHistory = getHistory();
  const targetIndex = currentHistory.findIndex((item) => item.id === id);

  if (targetIndex === -1) {
    return null;
  }

  const existingItem = currentHistory[targetIndex];
  const merged = {
    ...existingItem,
    ...updates,
    id: existingItem.id, // Preserve original ID
    created_at: existingItem.created_at, // Preserve original creation timestamp
  };

  const updatedNormalized = normalizeHistoryItem(merged);
  currentHistory[targetIndex] = updatedNormalized;

  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentHistory));
    } catch (error) {
      console.error('[historyService] Failed to update item in LocalStorage:', error);
      memoryStore = currentHistory;
    }
  } else {
    memoryStore = currentHistory;
  }

  return updatedNormalized;
};

/**
 * Delete a specific history record by ID.
 * @param {string} id
 * @returns {boolean} True if deleted, false if not found
 */
export const deleteHistory = (id) => {
  if (!id) return false;

  const currentHistory = getHistory();
  const filtered = currentHistory.filter((item) => item.id !== id);

  if (filtered.length === currentHistory.length) {
    return false;
  }

  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('[historyService] Failed to delete item from LocalStorage:', error);
      memoryStore = filtered;
    }
  } else {
    memoryStore = filtered;
  }

  return true;
};

/**
 * Clear all history records.
 * @returns {boolean}
 */
export const clearHistory = () => {
  if (isStorageAvailable()) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('[historyService] Failed to clear LocalStorage:', error);
      memoryStore = [];
    }
  } else {
    memoryStore = [];
  }
  return true;
};

