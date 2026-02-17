import { api } from '@/lib/api';
import {
  ApiResponse,
  Batch,
  GetBatchesInput,
  PaginatedResult,
} from '@repo/types';
import { useQuery } from '@tanstack/react-query';

export const useGetBatchesByProduct = (
  productId: number,
  params: GetBatchesInput,
) => {
  return useQuery({
    queryKey: ['batches', params],
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
