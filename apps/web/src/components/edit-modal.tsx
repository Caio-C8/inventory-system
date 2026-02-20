'use client';

import { useState } from 'react';
import { useForm, DefaultValues } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CurrencyInput } from '@/components/ui/currency-input';

export type EditFieldType = 'text' | 'number' | 'date' | 'currency';

export interface EditFieldConfig<T> {
  name: keyof T;
  label: string;
  type: EditFieldType;
  placeholder?: string;
}

interface EditModalProps<T> {
  title?: string;
  entity: T;
  fields: EditFieldConfig<T>[];
  schema: z.ZodType<any, any>;
  onSave: (data: T) => void | Promise<void>;
  isPendingSave?: boolean;
  onDelete?: () => void | Promise<void>;
  isPendingDelete?: boolean;
  onRestore?: () => void | Promise<void>;
  isPendingRestore?: boolean;
}

export function EditModal<T extends Record<string, any>>({
  title = 'Editar',
  entity,
  fields,
  schema,
  onSave,
  isPendingSave,
  onDelete,
  isPendingDelete,
  onRestore,
  isPendingRestore,
}: EditModalProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: entity as DefaultValues<T>,
  });

  const handleSubmit = async (data: T) => {
    const payload = { ...data } as Record<string, any>;
    const originalEntity = entity as Record<string, any>;

    fields.forEach((field) => {
      const key = field.name as string;
      const currentValue = payload[key];
      const originalValue = originalEntity[key];

      let isSame = false;

      if (field.type === 'date') {
        if (currentValue && originalValue) {
          const currentObj = new Date(currentValue);
          const originalObj = new Date(originalValue);

          if (currentObj.getTime() === originalObj.getTime()) {
            isSame = true;
          }
        } else if (!currentValue && !originalValue) {
          isSame = true;
        }
      } else {
        if (currentValue === originalValue) {
          isSame = true;
        }
      }

      if (isSame) {
        payload[key] = undefined;
      }
    });

    await onSave(payload as T);
    setIsOpen(false);
  };

  const handleDelete = async () => {
    if (!onDelete) {
      return;
    }

    await onDelete();
    setIsOpen(false);
  };

  const handleRestore = async () => {
    if (!onRestore) {
      return;
    }

    await onRestore();
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      form.reset(entity as DefaultValues<T>);
    }
  };

  const isAnyActionPending =
    isPendingSave || isPendingDelete || isPendingRestore;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="link cursor-pointer">Editar</div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-5 py-4">
              {fields.map((field) => (
                <FormField
                  key={field.name as string}
                  control={form.control}
                  name={field.name as any}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        {field.type === 'currency' ? (
                          <CurrencyInput
                            placeholder={field.placeholder ?? 'R$ 0,00'}
                            value={formField.value}
                            onChange={formField.onChange}
                            disabled={isAnyActionPending}
                          />
                        ) : (
                          <Input
                            type={field.type}
                            placeholder={field.placeholder}
                            {...formField}
                            value={
                              field.type === 'date' && formField.value
                                ? new Date(formField.value)
                                    .toISOString()
                                    .split('T')[0]
                                : (formField.value ?? '')
                            }
                            onChange={(e) => {
                              const val = e.target.value;

                              if (field.type === 'number' && val !== '') {
                                formField.onChange(Number(val));
                              } else if (field.type === 'date' && val !== '') {
                                formField.onChange(
                                  new Date(`${val}T00:00:00Z`),
                                );
                              } else {
                                formField.onChange(val);
                              }
                            }}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="flex justify-between w-full mt-4 border-t pt-4">
              <div>
                {onDelete && !entity.deleted_at && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={isAnyActionPending}
                      >
                        {isPendingDelete ? 'Removendo...' : 'Remover'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover este registro?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Confirmar Exclusão
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                {onRestore && entity.deleted_at && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="primary"
                        disabled={isAnyActionPending}
                      >
                        {isPendingRestore ? 'Restaurando...' : 'Restaurar'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Confirmar Restauração
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja restaurar este registro para
                          que ele volte a ficar ativo?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRestore}>
                          Confirmar Restauração
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isAnyActionPending}
                >
                  Cancelar
                </Button>

                <Button
                  variant="success"
                  type="submit"
                  disabled={isAnyActionPending}
                >
                  {isPendingSave ? 'Salvando...' : 'Salvar alterações'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
