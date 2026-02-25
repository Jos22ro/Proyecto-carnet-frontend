
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ApiResponse,
  PaginatedResponse,
  Solicitud,
  SolicitudConDetalles,
  CreateSolicitudRequest,
  UpdateSolicitudRequest,
  SolicitudFilters,
  Emprendedor,
  Mascota,
  LoginRequest,
  LoginResponse,
  AuthUser,
  StatsResponse
} from '../types/api.js';

// Create axios instance
const createApiInstance = (): AxiosInstance => {
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  const api = axios.create({
    baseURL,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor for auth token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for error handling
  api.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return api;
};

const api = createApiInstance();

// Auth API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    const response = await api.post('/api/auth/refresh');
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<AuthUser>> => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  }
};

// Solicitudes API
export const solicitudesApi = {
  getAll: async (filters?: SolicitudFilters): Promise<PaginatedResponse<Solicitud>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/api/solicitudes?${params}`);
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<SolicitudConDetalles>> => {
    const response = await api.get(`/api/solicitudes/${id}`);
    return response.data;
  },

  create: async (data: CreateSolicitudRequest): Promise<ApiResponse<SolicitudConDetalles>> => {
    const response = await api.post('/api/solicitudes', data);
    return response.data;
  },

  update: async (id: number, data: UpdateSolicitudRequest): Promise<ApiResponse<SolicitudConDetalles>> => {
    const response = await api.put(`/api/solicitudes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete(`/api/solicitudes/${id}`);
    return response.data;
  }
};

// Emprendedores API
export const emprendedoresApi = {
  getAll: async (): Promise<ApiResponse<Emprendedor[]>> => {
    const response = await api.get('/api/emprendedores');
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Emprendedor>> => {
    const response = await api.get(`/api/emprendedores/${id}`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<StatsResponse>> => {
    const response = await api.get('/api/emprendedores/stats');
    return response.data;
  }
};

// Mascotas API
export const mascotasApi = {
  getAll: async (): Promise<ApiResponse<Mascota[]>> => {
    const response = await api.get('/api/mascotas');
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Mascota>> => {
    const response = await api.get(`/api/mascotas/${id}`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<StatsResponse>> => {
    const response = await api.get('/api/mascotas/stats');
    return response.data;
  }
};

// Webhook API
export const webhookApi = {
  test: async (): Promise<ApiResponse> => {
    const response = await api.get('/api/webhook/test');
    return response.data;
  },

  getStatus: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/api/webhook/status');
    return response.data;
  }
};

// Health check
export const healthApi = {
  check: async (): Promise<ApiResponse<{ status: string; timestamp: string }>> => {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api;