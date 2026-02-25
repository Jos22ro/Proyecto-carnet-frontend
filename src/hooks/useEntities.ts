import { useQuery } from '@tanstack/react-query';
import { emprendedoresApi, mascotasApi } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.js';

export const useEmprendedores = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['emprendedores'],
    queryFn: () => emprendedoresApi.getAll(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEmprendedorStats = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['emprendedor-stats'],
    queryFn: () => emprendedoresApi.getStats(),
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useMascotas = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['mascotas'],
    queryFn: () => mascotasApi.getAll(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMascotaStats = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['mascota-stats'],
    queryFn: () => mascotasApi.getStats(),
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};