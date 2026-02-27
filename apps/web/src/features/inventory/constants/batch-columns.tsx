import { Batch, BatchWithProduct, UpdateBatchSchema } from '@repo/types';
import { formatBrl, formatDate } from '@repo/utils';
import {
  EDIT_ALL_BATCHES_CONFIG,
  EDIT_BATCH_BY_PRODUCT_CONFIG,
  EditBatchActionCell,
} from './edit-batch';

export const BATCHES_BY_PRODUCT_COLUMNS = [
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
    cell: (batch: Batch) => (
      <EditBatchActionCell
        batch={batch}
        editConfig={EDIT_BATCH_BY_PRODUCT_CONFIG}
      />
    ),
  },
];

export const ALL_BATCHES_COLUMNS = [
  {
    header: 'Código',
    cell: (batch: BatchWithProduct) => batch.product.code,
  },
  {
    header: 'Produto',
    cell: (batch: BatchWithProduct) => batch.product.name,
  },
  {
    header: 'Nº nota fiscal',
    cell: (batch: BatchWithProduct) => batch.tax_invoice_number,
  },
  {
    header: 'Preço de custo unitário',
    cell: (batch: BatchWithProduct) => formatBrl(batch.unit_cost_price),
  },
  {
    header: 'Data de validade',
    cell: (batch: BatchWithProduct) => formatDate(batch.expiration_date),
  },
  {
    header: 'Data de compra',
    cell: (batch: BatchWithProduct) => formatDate(batch.purchase_date),
  },
  {
    header: 'Quantidade em estoque',
    cell: (batch: BatchWithProduct) => batch.current_quantity,
  },
  {
    header: 'Quantidade comrpada',
    cell: (batch: BatchWithProduct) => batch.purchase_quantity,
  },
  {
    header: '',
    cell: (batch: BatchWithProduct) => (
      <EditBatchActionCell batch={batch} editConfig={EDIT_ALL_BATCHES_CONFIG} />
    ),
  },
];
