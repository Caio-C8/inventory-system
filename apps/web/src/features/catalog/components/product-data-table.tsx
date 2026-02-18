'use client';

import { DataTable } from '@/components/data-table';
import { PRODUCT_COLUMNS } from '../constants/product-columns';
import { Product } from '@repo/types';

interface ProductDataProps {
  product: Product;
}

export const ProductDataTable = ({ product }: ProductDataProps) => {
  return (
    <DataTable
      columns={PRODUCT_COLUMNS}
      data={[product]}
      getRowKey={(product) => product.id}
    />
  );
};
