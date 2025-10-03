import { LoginRequest, LoginResponse, VacationRequest, VacationRequestDTO, User, UserDTO, AuditLog, StatisticsDTO, Region, TeamStatistics, TeamCalendarEvent } from '../types';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth header to requests if credentials exist
api.interceptors.request.use((config) => {
  const auth = localStorage.getItem('auth');
  if (auth) {
    const { username, password } = JSON.parse(auth);
    config.auth = { username, password };
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials, {
      auth: credentials,
    });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};

// Vacation API
export const vacationAPI = {
  createRequest: async (data: VacationRequestDTO): Promise<VacationRequest> => {
    const response = await api.post<VacationRequest>('/vacations', data);
    return response.data;
  },

  getAllRequests: async (): Promise<VacationRequest[]> => {
    const response = await api.get<VacationRequest[]>('/vacations');
    return response.data;
  },

  getRequestsByEmployee: async (employeeName: string): Promise<VacationRequest[]> => {
    const response = await api.get<VacationRequest[]>(`/vacations/employee/${employeeName}`);
    return response.data;
  },

  approveRequest: async (id: number): Promise<VacationRequest> => {
    const response = await api.put<VacationRequest>(`/vacations/${id}/approve`);
    return response.data;
  },

  rejectRequest: async (id: number): Promise<VacationRequest> => {
    const response = await api.put<VacationRequest>(`/vacations/${id}/reject`);
    return response.data;
  },
};

// Admin API (Super Manager only)
export const adminAPI = {
  // User Management
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/admin/users');
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/admin/users/${id}`);
    return response.data;
  },

  createUser: async (data: UserDTO): Promise<User> => {
    const response = await api.post<User>('/admin/users', data);
    return response.data;
  },

  updateUser: async (id: number, data: UserDTO): Promise<User> => {
    const response = await api.put<User>(`/admin/users/${id}`, data);
    return response.data;
  },

  deactivateUser: async (id: number): Promise<void> => {
    await api.put(`/admin/users/${id}/deactivate`);
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },

  updateVacationQuota: async (id: number, totalDays: number): Promise<User> => {
    const response = await api.put<User>(`/admin/users/${id}/quota?totalDays=${totalDays}`);
    return response.data;
  },

  // Statistics & Reports
  getStatistics: async (): Promise<StatisticsDTO> => {
    const response = await api.get<StatisticsDTO>('/admin/statistics');
    return response.data;
  },

  getVacationUsageReport: async (): Promise<Record<string, any>> => {
    const response = await api.get<Record<string, any>>('/admin/reports/vacation-usage');
    return response.data;
  },

  // Audit Logs
  exportAuditLogsCSV: async (): Promise<Blob> => {
    const response = await api.get('/audit/logs/export/csv', {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Region API
export const regionAPI = {
  getAllRegions: async (): Promise<Region[]> => {
    const response = await api.get<Region[]>('/regions');
    return response.data;
  },

  getRegionById: async (id: number): Promise<Region> => {
    const response = await api.get<Region>(`/regions/${id}`);
    return response.data;
  },
};

// Manager API
export const managerAPI = {
  getTeamMembers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/manager/team');
    return response.data;
  },

  getTeamStatistics: async (): Promise<TeamStatistics[]> => {
    const response = await api.get<TeamStatistics[]>('/manager/team/statistics');
    return response.data;
  },

  getTeamCalendar: async (startDate?: string, endDate?: string): Promise<TeamCalendarEvent[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await api.get<TeamCalendarEvent[]>(`/manager/team/calendar?${params.toString()}`);
    return response.data;
  },

  getTeamOverloadWarnings: async (): Promise<Record<string, number>> => {
    const response = await api.get<Record<string, number>>('/manager/team/overload');
    return response.data;
  },
};

export default api;
