'use client';

import { DataTable } from '@/components/data-table';
import { useFilterUrl } from '@/hooks/use-filter-url';
import { GetBatchesSchema } from '@repo/types';
import { useGetBatchesByProduct } from '@/features/inventory/hooks/use-batches';
import { BATCH_COLUMNS } from '@/features/inventory/constants/batch-columns';
import { useParams } from 'next/navigation';

export const BatchesByProductList = () => {
  const { params: filterParams, updateParams } = useFilterUrl();
  const params = useParams();

  const validatedParams = GetBatchesSchema.parse({
    ...filterParams,
    page: filterParams.page ? Number(filterParams.page) : 1,
    limit: filterParams.limit ? Number(filterParams.limit) : 10,
  });

  const { data, isLoading } = useGetBatchesByProduct(
    Number(params.id),
    validatedParams,
  );

  const showTable = isLoading || (data?.data && data.data.length > 0);

  return (
    <>
      {showTable ? (
        <DataTable
          columns={BATCH_COLUMNS}
          data={data?.data}
          isLoading={isLoading}
          meta={{
            page: data?.meta.page || 1,
            lastPage: data?.meta.last_page || 1,
            total: data?.meta.total || 1,
            limit: data?.meta.limit || 1,
          }}
          onPageChange={(page) => updateParams({ page })}
          getRowKey={(batch) => batch.id}
        />
      ) : (
        <div className="text-center text-2xl bg-muted/20 rounded-lg border py-10">
          Esta produto não tem lotes cadastrados ou não há lotes que
          correspondem a pesquisa
        </div>
      )}
    </>
  );
};
