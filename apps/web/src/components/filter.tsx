'use client';

import { DefaultValues, useForm, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { useFilterUrl } from '@/hooks/use-filter-url';
import { useDebounce } from '@/hooks/use-debounce';
import { useEffect, useMemo, useRef } from 'react';
import { CurrencyInput } from '@/components/ui/currency-input';

export type FilterFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'select'
  | 'currency';

export interface FilterFieldConfig<T> {
  name: keyof T;
  label: string;
  type: FilterFieldType;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

interface FilterProps<T> {
  fields: FilterFieldConfig<T>[];
}

export function Filter<T extends Record<string, any>>({
  fields,
}: FilterProps<T>) {
  const { updateParams, params } = useFilterUrl();
  const isInitialMount = useRef(true);
  const isResetting = useRef(false);

  const form = useForm<T>({
    values: {
      ...Object.fromEntries(fields.map((f) => [f.name, ''])),
      ...params,
    } as T,
  });

  const watchedValues = useWatch({ control: form.control });
  const debouncedValues = useDebounce(watchedValues, 500);

  const managedKeys = useMemo(
    () => fields.map((f) => f.name as string),
    [fields],
  );

  const getOnlyActiveFilters = (obj: Record<string, any>) => {
    const result: Record<string, string> = {};

    managedKeys.forEach((key) => {
      const value = obj?.[key];

      const fieldConfig = fields.find((f) => f.name === key);

      if (fieldConfig?.type === 'currency' && value === 0) {
        result[key] = '';
      } else {
        result[key] =
          value === null || value === undefined || value === ''
            ? ''
            : String(value);
      }
    });

    return result;
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const currentFilters = getOnlyActiveFilters(debouncedValues);
    const urlFilters = getOnlyActiveFilters(params);

    if (isResetting.current) {
      if (Object.keys(currentFilters).length === 0) {
        isResetting.current = false;
      }
      return;
    }

    const hasChanged =
      JSON.stringify(currentFilters) !== JSON.stringify(urlFilters);

    if (hasChanged) {
      updateParams(currentFilters);
    }
  }, [debouncedValues, updateParams, params, managedKeys.join(',')]);

  const handleReset = () => {
    isResetting.current = true;

    const resetValues = Object.fromEntries(
      fields.map((f) => [f.name, '']),
    ) as DefaultValues<T>;

    form.reset(resetValues);
    updateParams(resetValues);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-card p-4 rounded-lg border border-border mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fields.map((field) => (
            <FormField
              key={field.name as string}
              control={form.control}
              name={field.name as any}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase text-muted-foreground">
                    {field.label}
                  </FormLabel>
                  <FormControl>
                    {field.type === 'select' ? (
                      <Select
                        onValueChange={formField.onChange}
                        value={formField.value?.toString() || ''}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === 'currency' ? (
                      <CurrencyInput
                        placeholder="R$ 0,00"
                        value={formField.value}
                        onChange={formField.onChange}
                      />
                    ) : (
                      <Input
                        type={field.type === 'date' ? 'date' : field.type}
                        placeholder={field.placeholder}
                        {...formField}
                        value={formField.value ?? ''}
                        onWheel={(e) => {
                          if (field.type === 'number') {
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                      />
                    )}
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            <X className="mr-2 h-4 w-4" /> Limpar
          </Button>
        </div>
      </form>
    </Form>
  );
}
