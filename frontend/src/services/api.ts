import axios from 'axios';
import type { AnalysisResponse } from '../types';

const API_BASE_URL = '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  analyzeEmailPaste: async (raw_email: string): Promise<AnalysisResponse> => {
    const response = await client.post<AnalysisResponse>('/analyze/email', {
      raw_email,
    });
    return response.data;
  },

  analyzeEmailFile: async (file: File): Promise<AnalysisResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await client.post<AnalysisResponse>('/analyze/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  checkHealth: async (): Promise<{ status: string; system: string; version: string }> => {
    const response = await client.get('/health');
    return response.data;
  }
};
