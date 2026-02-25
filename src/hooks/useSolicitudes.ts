import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { solicitudesApi } from '../services/api.js';
import { 
  SolicitudFilters, 
  SolicitudConDetalles,
  CreateSolicitudRequest,
  UpdateSolicitudRequest
} from '../types/api.js';
import { useAuth } from '../contexts/AuthContext.js';

export const useSolicitudes = (filters?: SolicitudFilters) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['solicitudes', filters],
    queryFn: () => solicitudesApi.getAll(filters),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  });
};

export const useSolicitud = (id: number) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['solicitud', id],
    queryFn: () => solicitudesApi.getById(id),
    enabled: isAuthenticated && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateSolicitud = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSolicitudRequest) => solicitudesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
    },
    onError: (error) => {
      console.error('Failed to create solicitud:', error);
    }
  });
};

export const useUpdateSolicitud = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSolicitudRequest }) =>
      solicitudesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
      queryClient.invalidateQueries({ queryKey: ['solicitud', variables.id] });
    },
    onError: (error) => {
      console.error('Failed to update solicitud:', error);
    }
  });
};

export const useDeleteSolicitud = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => solicitudesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
    },
    onError: (error) => {
      console.error('Failed to delete solicitud:', error);
    }
  });
};