import { Batch } from '@repo/types';
import { formatBrl, formatDate } from '@repo/utils';

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
    cell: (batch: Batch) => <div className="link">Editar</div>,
  },
];
