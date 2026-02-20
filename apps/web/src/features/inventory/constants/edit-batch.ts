import { EditFieldConfig } from '@/components/edit-modal';
import { UpdateBatchInput } from '@repo/types';

export const EDIT_BATCH_CONFIG: EditFieldConfig<UpdateBatchInput>[] = [
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
    label: 'Estoque atual',
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
