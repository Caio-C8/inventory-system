'use client';

import { Button } from '@/components/ui/button';
import { Funnel } from 'lucide-react';

interface FilterToggleButtonProps {
  onClick: () => void;
  isActive?: boolean;
}

export function FilterToggleButton({
  onClick,
  isActive,
}: FilterToggleButtonProps) {
  return (
    <Button
      type="button"
      variant={isActive ? 'default' : 'outline'}
      size="icon"
      onClick={onClick}
      title="Filtros avançados"
    >
      <Funnel className="h-4 w-4" />
    </Button>
  );
}
