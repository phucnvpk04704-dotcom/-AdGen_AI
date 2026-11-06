/**
 * Service to check Backend health status.
 */

import apiClient from './api';

/**
 * Check Backend health endpoint.
 * @returns {Promise<{success: boolean, message: string, status: string}>}
 */
export const checkBackendHealth = async () => {
  const response = await apiClient.get('/api/v1/health');
  return response.data;
};

