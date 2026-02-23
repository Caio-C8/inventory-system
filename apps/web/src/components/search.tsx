'use client';

import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';
import { useFilterUrl } from '@/hooks/use-filter-url';
import { useDebounce } from '@/hooks/use-debounce';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SearchProps {
  placeholder?: string;
  className?: string;
}

export function Search({
  placeholder = 'Pesquisar...',
  className,
}: SearchProps) {
  const { updateParams, params } = useFilterUrl();

  const [value, setValue] = useState(params.search || '');

  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    setValue(params.search || '');
  }, [params.search]);

  useEffect(() => {
    const currentSearch = params.search || '';

    if (debouncedValue !== currentSearch) {
      updateParams({ search: debouncedValue || undefined });
    }
  }, [debouncedValue, updateParams, params.search]);

  return (
    <div className={cn('relative w-full', className)}>
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="pl-9"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
