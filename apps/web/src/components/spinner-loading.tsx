import { Spinner } from '@/components/ui/spinner';

export const SpinnerLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Spinner className="size-16" />
      <span className="mt-4 text-muted-foreground">Carregando...</span>
    </div>
  );
};
