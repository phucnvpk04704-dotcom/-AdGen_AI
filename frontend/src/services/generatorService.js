/**
 * Generator Service communicating with FastAPI Backend Gemini endpoints.
 */

import apiClient from './api';

/**
 * Generate 3-3-5 advertising content via Gemini AI.
 * @param {{ product_name: string, description: string, target_audience: string, tone: string }} payload
 * @returns {Promise<{ success: boolean, data: { captions: Array, headlines: Array, hashtags: Array }, message: string }>}
 */
export const generateAdvertisingContent = async (payload) => {
  const response = await apiClient.post('/api/v1/generate', payload);
  return response.data;
};

/**
 * Regenerate content (all, single caption, or single headline) via Gemini AI.
 * @param {{ product_name: string, description: string, target_audience: string, tone: string, target_type: 'all' | 'caption' | 'headline', target_id?: string, existing_content?: string }} payload
 * @returns {Promise<{ success: boolean, target_type: string, data?: object, item?: object, message: string }>}
 */
export const regenerateAdvertisingContent = async (payload) => {
  const response = await apiClient.post('/api/v1/regenerate', payload);
  return response.data;
};

/**
 * Get server metadata and verify Gemini configuration status.
 * @returns {Promise<{ service: string, version: string, gemini_configured: boolean, gemini_model: string }>}
 */
export const getServerMetadata = async () => {
  const response = await apiClient.get('/');
  return response.data;
};

