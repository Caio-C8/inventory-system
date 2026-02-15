import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

interface TableSkeletonProps {
  columnsCount: number;
  rowsCount?: number;
}

export function TableSkeleton({
  columnsCount,
  rowsCount = 10,
}: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowsCount }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="h-[50px]">
          {Array.from({ length: columnsCount }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton className="h-4 w-full rounded-md" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
