import { DataTable } from '@/components/data-table';
import { PRODUCT_DETAIL_COLUMN } from '../constants/product-columns';
import { Product } from '@repo/types';

interface ProductDataProps {
  product?: Product;
  isLoading?: boolean;
}

export const ProductDataTable = ({ product, isLoading }: ProductDataProps) => {
  return (
    <DataTable
      columns={PRODUCT_DETAIL_COLUMN}
      data={product ? [product] : []}
      isLoading={isLoading}
      meta={{
        limit: 1,
        page: 0,
        total: 0,
        lastPage: 0,
      }}
      getRowKey={(product) => product.id}
    />
  );
};
