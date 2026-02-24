import { NotFoundButtons } from '@/components/not-found-buttons';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página não encontrada',
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-4">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          404
        </h1>
        <h2 className="text-2xl font-semibold">Página não encontrada</h2>
        <p className="text-muted-foreground max-w-[500px]">
          O recurso que você está tentando acessar não existe ou foi movido para
          outro endereço.
        </p>
      </div>

      <NotFoundButtons />
    </div>
  );
}
