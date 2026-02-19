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
import { NumericFormat } from 'react-number-format';
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
} from './ui/alert-dialog';

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
  onSave,
  isPendingSave,
  onDelete,
  isPendingDelete,
  onRestore,
  isPendingRestore,
}: EditModalProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<T>({
    defaultValues: entity as DefaultValues<T>,
  });

  const handleSubmit = async (data: T) => {
    await onSave(data);
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
                          <NumericFormat
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                            decimalScale={2}
                            fixedDecimalScale
                            allowNegative={false}
                            customInput={Input}
                            placeholder={field.placeholder || 'R$ 0,00'}
                            value={formField.value ?? ''}
                            onValueChange={(values) => {
                              formField.onChange(values.floatValue);
                            }}
                          />
                        ) : (
                          <Input
                            type={field.type}
                            placeholder={field.placeholder}
                            {...formField}
                            value={formField.value ?? ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              formField.onChange(
                                field.type === 'number' && val !== ''
                                  ? Number(val)
                                  : val,
                              );
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
                        {isPendingDelete ? 'Excluindo...' : 'Excluir'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este registro?
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
