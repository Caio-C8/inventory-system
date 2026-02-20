import { Batch, UpdateBatchSchema } from '@repo/types';
import { formatBrl, formatDate } from '@repo/utils';
import {
  useDeleteBatch,
  useUpdateBatch,
} from '@/features/inventory/hooks/use-batches';
import { EditModal } from '@/components/edit-modal';
import { EDIT_BATCH_CONFIG } from '@/features/inventory/constants/edit-batch';

const EditBatchActionCell = ({ batch }: { batch: Batch }) => {
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
      title="Editar produto"
      entity={batch}
      fields={EDIT_BATCH_CONFIG}
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

export const BATCH_COLUMNS = [
  {
    header: 'Nº nota fiscal',
    cell: (batch: Batch) => batch.tax_invoice_number,
  },
  {
    header: 'Preço de custo unitário',
    cell: (batch: Batch) => formatBrl(batch.unit_cost_price),
  },
  {
    header: 'Data de validade',
    cell: (batch: Batch) => formatDate(batch.expiration_date),
  },
  {
    header: 'Data de compra',
    cell: (batch: Batch) => formatDate(batch.purchase_date),
  },
  {
    header: 'Quantidade em estoque',
    cell: (batch: Batch) => batch.current_quantity,
  },
  {
    header: 'Quantidade comrpada',
    cell: (batch: Batch) => batch.purchase_quantity,
  },
  {
    header: '',
    cell: (batch: Batch) => <EditBatchActionCell batch={batch} />,
  },
];
