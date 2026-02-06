'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();

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

      <div className="flex gap-2">
        <Button
          className="cursor-pointer"
          variant="outline"
          onClick={() => router.back()}
        >
          Voltar para a página anterior
        </Button>

        <Button
          className="cursor-pointer"
          onClick={() => router.push('/products')}
        >
          Ir para o Dashboard
        </Button>
      </div>
    </div>
  );
}
