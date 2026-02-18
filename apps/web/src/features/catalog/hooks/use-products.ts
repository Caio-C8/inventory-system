import { api } from '@/lib/api';
import {
  CreateProductInput,
  GetProductsInput,
  PaginatedResult,
  Product,
  UpdateProductInput,
  ApiResponse,
} from '@repo/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export const useGetProducts = (params: GetProductsInput) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedResult<Product>>>(
        '/products',
        {
          params,
        },
      );

      return response.data.data;
    },
  });
};

export const useGetProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Product>>(`/products/${id}`);

      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductInput) => {
      const response = await api.post('/products', data);

      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });

      toast.success(response.data?.message || 'Produto criado com sucesso.');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data.message || 'Ocorreu um erro inesperado.',
      );
    },
  });
};

export const useUpdateProduct = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProductInput) => {
      const response = await api.patch(`products/${id}`, data);

      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });

      toast.success(response.data?.message || 'Produto alterado com sucesso.');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data.message || 'Ocorreu um erro inesperado.',
      );
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`products/${id}`);

      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });

      toast.success(response.message || 'Produto removido com sucesso.');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data.message || 'Ocorreu um erro inesperado.',
      );
    },
  });
};

export const useRestoreProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch(`products/${id}/restore`);

      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });

      toast.success(
        response.data?.message || 'Produto restaurado com sucesso.',
      );
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data.message || 'Ocorreu um erro inesperado.',
      );
    },
  });
};
