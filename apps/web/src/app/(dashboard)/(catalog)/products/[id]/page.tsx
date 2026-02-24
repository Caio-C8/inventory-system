'use client';

import NotFound from '@/app/not-found';
import { SearchAndFilter } from '@/components/search-and-filter';
import { ProductDataTable } from '@/features/catalog/components/product-data-table';
import { useGetProduct } from '@/features/catalog/hooks/use-products';
import { BatchesByProductList } from '@/features/inventory/components/batches-by-product-list';
import { BATCH_FILTERS_CONFIG } from '@/features/inventory/constants/batch-filters';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = Number(params.id);

  const { data: productData, isLoading: isLoadingProduct } =
    useGetProduct(productId);

  const product = productData?.data;

  useEffect(() => {
    if (product?.name) {
      document.title = `${product.name} | Inventory System`;
    } else {
      document.title = 'Carregando Produto... | Inventory System';
    }
  }, [product?.name]);

  if (!product) return <NotFound />;

  return (
    <div className="flex flex-col gap-[65px]">
      <h1 className="text-center text-4xl">{product.name}</h1>
      <ProductDataTable product={product} />

      <h2 className="text-center text-3xl">Lotes do produto</h2>

      <SearchAndFilter
        searchPlaceholder="Pesquise pelo nº da nota fiscal"
        filterFields={BATCH_FILTERS_CONFIG}
        className="mx-auto max-w-lg"
      />

      <BatchesByProductList />
    </div>
  );
}
