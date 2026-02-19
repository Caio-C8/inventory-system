'use client';

import NotFound from '@/app/not-found';
import { Filter } from '@/components/filter';
import { Search } from '@/components/search';
import { ProductDataTable } from '@/features/catalog/components/product-data-table';
import { useGetProduct } from '@/features/catalog/hooks/use-products';
import { BatchesByProductList } from '@/features/inventory/components/batches-by-product-list';
import { BATCH_FILTERS_CONFIG } from '@/features/inventory/constants/batch-filters';
import { useParams } from 'next/navigation';

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = Number(params.id);

  const { data: productData, isLoading: isLoadingProduct } =
    useGetProduct(productId);

  const product = productData?.data;

  if (!product) return <NotFound />;

  return (
    <div className="flex flex-col gap-[65px]">
      <h1 className="text-center text-4xl">{product.name}</h1>
      <ProductDataTable product={product} />

      <h2 className="text-center text-3xl">Lotes do produto</h2>

      <div className="flex justify-center">
        <Search placeholder="Pesquise pelo nº da nota fiscal" />
      </div>

      <Filter fields={BATCH_FILTERS_CONFIG} />

      <BatchesByProductList />
    </div>
  );
}
