'use client';

import { Search } from './search';
import { FilterToggleButton } from './filter-toggle-button';
import { cn } from '@/lib/utils';

interface SearchWithFilterProps {
  placeholder?: string;
  isFiltersVisible: boolean;
  onToggleFilters: () => void;
  className?: string;
}

export function SearchWithFilter({
  placeholder,
  isFiltersVisible,
  onToggleFilters,
  className,
}: SearchWithFilterProps) {
  return (
    <div className={cn('flex w-full max-w-lg items-center gap-2', className)}>
      <div className="flex-1">
        <Search placeholder={placeholder} />
      </div>

      <FilterToggleButton
        isActive={isFiltersVisible}
        onClick={onToggleFilters}
      />
    </div>
  );
}
