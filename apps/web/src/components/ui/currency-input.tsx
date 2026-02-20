'use client';

import * as React from 'react';
import { Input } from './input';

interface CurrencyInputProps extends Omit<
  React.ComponentProps<'input'>,
  'value' | 'onChange'
> {
  value?: number | string | null;
  onChange?: (value: number | '') => void;
}

function CurrencyInput({ value, onChange, ...props }: CurrencyInputProps) {
  const formattedValue =
    value !== '' && value !== null && value !== undefined
      ? new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(Number(value))
      : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');

    if (!digits) {
      onChange?.('');
      return;
    }

    const rawValue = Number(digits) / 100;

    onChange?.(rawValue);
  };

  return (
    <Input
      {...props}
      type="text"
      value={formattedValue}
      onChange={handleChange}
    />
  );
}

export { CurrencyInput };
