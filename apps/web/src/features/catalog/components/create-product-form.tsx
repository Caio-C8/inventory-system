'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateProductInput, CreateProductSchema } from '@repo/types';
import { useForm } from 'react-hook-form';
import { useCreateProduct } from '@/features/catalog/hooks/use-products';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CurrencyInput } from '@/components/ui/currency-input';

export const CreateProductForm = () => {
  const { mutate, isPending } = useCreateProduct();

  const form = useForm<CreateProductInput>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: '',
      code: '',
      barcode: '',
      sale_price: undefined,
    },
  });

  const onSubmit = (data: CreateProductInput) => {
    mutate(data, {
      onSuccess: () => {
        form.reset({
          name: '',
          code: '',
          barcode: '',
          sale_price: undefined,
        });
      },
      onError: (error: any) => {
        const backendErrors = error.response?.data?.errors;

        if (Array.isArray(backendErrors)) {
          backendErrors.forEach((err: { field: string; message: string }) => {
            form.setError(err.field as any, {
              type: 'manual',
              message: err.message,
            });
          });
        }
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-[30px] justify-center"
      >
        <div className="grid grid-cols-2 gap-[30px]">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Nome:</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Nome do produto"
                    {...field}
                    className="w-[300px]"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Código:</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Código do produto"
                    {...field}
                    className="w-[300px]"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sale_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Preço de venda:</FormLabel>

                <FormControl>
                  <CurrencyInput
                    placeholder="R$ 0,00"
                    className="w-[300px]"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Código de barras:</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Código de barras do produto"
                    {...field}
                    className="w-[300px]"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-center">
          <Button variant="success" type="submit" disabled={isPending}>
            {isPending ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
