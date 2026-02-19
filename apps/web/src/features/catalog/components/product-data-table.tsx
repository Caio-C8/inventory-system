'use client';

import { DataTable } from '@/components/data-table';
import { PRODUCT_DETAIL_COLUMN } from '../constants/product-columns';
import { Product } from '@repo/types';

interface ProductDataProps {
  product: Product;
}

export const ProductDataTable = ({ product }: ProductDataProps) => {
  return (
    <DataTable
      columns={PRODUCT_DETAIL_COLUMN}
      data={[product]}
      getRowKey={(product) => product.id}
    />
  );
};
