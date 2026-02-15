'use client';

import { DataTable } from '@/components/data-table';
import { useGetProducts } from '@/features/catalog/hooks/use-products';
import { useFilterUrl } from '@/hooks/use-filter-url';
import { GetProductsSchema } from '@repo/types';
import { PRODUCT_COLUMNS } from '@/features/catalog/constants/product-columns';

export const ProductsList = () => {
  const { params, updateParams } = useFilterUrl();

  const validatedParams = GetProductsSchema.parse({
    ...params,
    page: params.page ? Number(params.page) : 1,
    limit: params.limit ? Number(params.limit) : 10,
  });

  const { data, isLoading } = useGetProducts(validatedParams);

  const showTable = isLoading || (data?.data && data.data.length > 0);

  return (
    <>
      {showTable ? (
        <DataTable
          columns={PRODUCT_COLUMNS}
          data={data?.data}
          isLoading={isLoading}
          meta={{
            page: data?.meta.page || 1,
            lastPage: data?.meta.last_page || 1,
            total: data?.meta.total || 1,
            limit: data?.meta.limit || 1,
          }}
          onPageChange={(page) => updateParams({ page })}
          getRowKey={(product) => product.id}
        />
      ) : (
        <div className="text-center text-2xl bg-muted/20 rounded-lg border py-10">
          Nenhum produto no catálogo ou não há produto que corresponde a
          pesquisa
        </div>
      )}
    </>
  );
};
