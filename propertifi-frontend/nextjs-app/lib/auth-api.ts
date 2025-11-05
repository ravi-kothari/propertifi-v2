/**
 * Authentication API Functions
 * Uses the consolidated API client for all auth-related requests
 */

import { apiClient } from './api';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../types/auth';

const AUTH_BASE_PATH = '/api/v2/auth';

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(`${AUTH_BASE_PATH}/register`, data);
  return response.data;
};

export const login = async (data: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(`${AUTH_BASE_PATH}/login`, data);
  return response.data;
};

export const logout = async (token: string): Promise<void> => {
  await apiClient.post(`${AUTH_BASE_PATH}/logout`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUser = async (token: string): Promise<User> => {
  const response = await apiClient.get<User>(`${AUTH_BASE_PATH}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const refreshToken = async (): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(`${AUTH_BASE_PATH}/refresh`);
  return response.data;
};
