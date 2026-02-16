import { Filter } from '@/components/filter';
import { Search } from '@/components/search';
import { ProductsList } from '@/features/catalog/components/product-list';
import { PRODUCT_FILTERS_CONFIG } from '@/features/catalog/constants/product-filters';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catálogo',
};

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-center text-4xl">Produtos no catálogo</h1>

      <div className="flex justify-center">
        <Search />
      </div>

      <Filter fields={PRODUCT_FILTERS_CONFIG} />

      <ProductsList />
    </div>
  );
}
