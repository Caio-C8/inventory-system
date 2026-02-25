import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface SpinnerLoadingProps {
  className?: string;
}

export const SpinnerLoading = ({ className }: SpinnerLoadingProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <Spinner className="size-16" />
      <span className="mt-4 text-muted-foreground">Carregando...</span>
    </div>
  );
};
