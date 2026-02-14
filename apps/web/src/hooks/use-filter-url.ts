'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export const useFilterUrl = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);

  const updateParams = (newParams: Record<string, any>) => {
    const urlParams = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        urlParams.set(key, String(value));
      } else {
        urlParams.delete(key);
      }
    });

    const keys = Object.keys(newParams);

    const isOnlyPagination = keys.length === 1 && keys[0] === 'page';

    if (!isOnlyPagination) {
      urlParams.set('page', '1');
    }

    router.replace(`${pathname}?${urlParams.toString()}`);
  };

  return { params, updateParams };
};
