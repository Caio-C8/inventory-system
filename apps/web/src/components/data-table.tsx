'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TablePagination } from '@/components/table-pagination';
import { ReactNode } from 'react';
import { Loading } from '@/components/loading';

interface Column<T> {
  header: string;
  cell: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data?: T[];
  isLoading?: boolean;
  meta?: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
  onPageChange?: (page: number) => void;
  getRowKey: (item: T) => string | number;
}

export function DataTable<T>({
  columns,
  data = [],
  isLoading,
  meta,
  onPageChange,
  getRowKey,
}: DataTableProps<T>) {
  if (isLoading) return <Loading />;

  return (
    <div className="w-full">
      <Table>
        <TableCaption className="text-right">
          {meta && `${meta.total} encontrados`}
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.map((column, index) => (
              <TableHead key={index} className="text-center text-base">
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={getRowKey(item)}
              className="even:bg-muted/70 even:hover:bg-muted/90 h-[50px]"
            >
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex} className="text-center text-base">
                  {column.cell(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {meta && onPageChange && meta.lastPage > 1 && (
        <TablePagination
          page={meta.page}
          lastPage={meta.lastPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
