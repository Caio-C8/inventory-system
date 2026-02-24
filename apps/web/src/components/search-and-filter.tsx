'use client';

import { useState } from 'react';
import { SearchWithFilter } from './search-with-filter';
import { Filter, FilterFieldConfig } from './filter';

interface SearchAndFilterProps<T> {
  searchPlaceholder?: string;
  filterFields: FilterFieldConfig<T>[];
  className?: string;
}

export function SearchAndFilter<T extends Record<string, any>>({
  searchPlaceholder = 'Pesquisar...',
  filterFields,
  className,
}: SearchAndFilterProps<T>) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex flex-col w-full gap-[65px]">
      <SearchWithFilter
        placeholder={searchPlaceholder}
        isFiltersVisible={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        className={className}
      />

      {showFilters && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <Filter fields={filterFields} />
        </div>
      )}
    </div>
  );
}
