import { EditFieldConfig, EditModal } from '@/components/edit-modal';
import {
  Batch,
  BatchWithProduct,
  UpdateBatchInput,
  UpdateBatchSchema,
} from '@repo/types';
import { useDeleteBatch, useUpdateBatch } from '../hooks/use-batches';

interface EditBatchActionCellProps<T> {
  batch: T;
  editConfig: EditFieldConfig<any>[];
  modalTitle?: string;
}

export const EditBatchActionCell = <T extends Batch | BatchWithProduct>({
  batch,
  editConfig,
  modalTitle = 'Editar Lote',
}: EditBatchActionCellProps<T>) => {
  const { mutate: updateFn, isPending: isPendingSave } = useUpdateBatch(
    batch.id,
    batch.product_id,
  );

  const { mutate: deleteFn, isPending: isPendingDelete } = useDeleteBatch(
    batch.id,
    batch.product_id,
  );

  return (
    <EditModal
      title={modalTitle}
      entity={batch}
      fields={editConfig}
      schema={UpdateBatchSchema}
      onSave={async (data) => {
        await updateFn(data);
      }}
      isPendingSave={isPendingSave}
      onDelete={async () => {
        await deleteFn();
      }}
      isPendingDelete={isPendingDelete}
    />
  );
};

export const EDIT_BATCH_BY_PRODUCT_CONFIG: EditFieldConfig<UpdateBatchInput>[] =
  [
    {
      name: 'tax_invoice_number',
      label: 'Nº nota fiscal',
      type: 'text',
      placeholder: 'Número da nota fiscal',
    },
    {
      name: 'unit_cost_price',
      label: 'Preço de custo unitário',
      type: 'currency',
      placeholder: 'Preço de custo unitário',
    },
    {
      name: 'expiration_date',
      label: 'Data de validade',
      type: 'date',
      placeholder: 'dd/mm/aaaa',
    },
    {
      name: 'purchase_date',
      label: 'Data de compra',
      type: 'date',
      placeholder: 'dd/mm/aaaa',
    },
    {
      name: 'current_quantity',
      label: 'Quantidade em estoque',
      type: 'number',
      placeholder: '0',
    },
    {
      name: 'purchase_quantity',
      label: 'Quantidade comprada',
      type: 'number',
      placeholder: '0',
    },
  ];

export const EDIT_ALL_BATCHES_CONFIG: EditFieldConfig<BatchWithProduct>[] = [
  {
    name: 'product.code',
    label: 'Código do produto',
    type: 'text',
    disabled: true,
  },
  {
    name: 'product.name',
    label: 'Nome do produto',
    type: 'text',
    disabled: true,
  },
  {
    name: 'tax_invoice_number',
    label: 'Nº nota fiscal',
    type: 'text',
    placeholder: 'Número da nota fiscal',
  },
  {
    name: 'unit_cost_price',
    label: 'Preço de custo unitário',
    type: 'currency',
    placeholder: 'Preço de custo unitário',
  },
  {
    name: 'expiration_date',
    label: 'Data de validade',
    type: 'date',
    placeholder: 'dd/mm/aaaa',
  },
  {
    name: 'purchase_date',
    label: 'Data de compra',
    type: 'date',
    placeholder: 'dd/mm/aaaa',
  },
  {
    name: 'current_quantity',
    label: 'Quantidade em estoque',
    type: 'number',
    placeholder: '0',
  },
  {
    name: 'purchase_quantity',
    label: 'Quantidade comprada',
    type: 'number',
    placeholder: '0',
  },
];
