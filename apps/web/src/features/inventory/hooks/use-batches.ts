import { api } from '@/lib/api';
import {
  ApiResponse,
  Batch,
  BatchWithProduct,
  GetBatchesInput,
  PaginatedResult,
  UpdateBatchInput,
} from '@repo/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export const useGetBatches = (params: GetBatchesInput) => {
  return useQuery({
    queryKey: ['batches', params],
    queryFn: async () => {
      const response = await api.get<
        ApiResponse<PaginatedResult<BatchWithProduct>>
      >('/batches', {
        params,
      });

      return response.data.data;
    },
  });
};

export const useGetBatchesByProduct = (
  productId: number,
  params: GetBatchesInput,
) => {
  return useQuery({
    queryKey: ['batches', productId, params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedResult<Batch>>>(
        `/batches/product/${productId}`,
        {
          params,
        },
      );

      return response.data.data;
    },
    enabled: !!productId,
  });
};

export const useUpdateBatch = (id: number, productId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateBatchInput) => {
      const response = await api.patch(`/batches/${id}`, data);

      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['batch', id] });

      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });

      toast.success(response.data?.message || 'Lote atualizado com sucesso');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data.message || 'Ocorreu um erro inesperado.',
      );
    },
  });
};

export const useSyncStockByProduct = (productId: Number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch(`/batches/${productId}/sync`);

      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });

      toast.success(
        response.data?.message || 'Estoque sincronizado com sucesso',
      );
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data.message || 'Ocorreu um erro inesperado.',
      );
    },
  });
};

export const useDeleteBatch = (id: number, productId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/batches/${id}`);

      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });

      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });

      toast.success(response.data?.message || 'Lote excluído com sucesso');
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data.message || 'Ocorreu um erro inesperado.',
      );
    },
  });
};
