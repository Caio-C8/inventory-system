'use client';

import { DataTable } from '@/components/data-table';
import { useGetBatches } from '../hooks/use-batches';
import { useFilterUrl } from '@/hooks/use-filter-url';
import { GetProductsSchema } from '@repo/types';
import { ALL_BATCHES_COLUMNS } from '../constants/batch-columns';

export const BatchesList = () => {
  const { params, updateParams } = useFilterUrl();

  const validatedParams = GetProductsSchema.parse({
    ...params,
    page: params.page ? Number(params.page) : 1,
    limit: params.limit ? Number(params.limit) : 10,
  });

  const { data, isLoading } = useGetBatches(validatedParams);

  const showTable = isLoading || (data?.data && data.data.length > 0);

  return (
    <>
      {showTable ? (
        <DataTable
          columns={ALL_BATCHES_COLUMNS}
          data={data?.data}
          isLoading={isLoading}
          meta={{
            page: data?.meta.page || 1,
            lastPage: data?.meta.last_page || 1,
            total: data?.meta.total || 1,
            limit: data?.meta.limit || validatedParams.limit,
          }}
          onPageChange={(page) => updateParams({ page })}
          getRowKey={(product) => product.id}
        />
      ) : (
        <div className="text-center text-2xl bg-muted/20 rounded-lg border py-10">
          Nenhum lote no estoque ou não há lote que corresponde a pesquisa
        </div>
      )}
    </>
  );
};
