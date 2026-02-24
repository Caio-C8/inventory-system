'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export const NotFoundButtons = () => {
  const router = useRouter();

  return (
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
  );
};
