import { SearchAndFilter } from '@/components/search-and-filter';
import { BatchesList } from '@/features/inventory/components/batches-list';
import { BATCH_FILTERS_CONFIG } from '@/features/inventory/constants/batch-filters';

export default function BatchesPage() {
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-center text-4xl">Lotes no estoque</h1>

      <SearchAndFilter
        filterFields={BATCH_FILTERS_CONFIG}
        className="mx-auto max-w-lg"
      />

      <BatchesList />
    </div>
  );
}
