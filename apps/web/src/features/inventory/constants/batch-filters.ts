import { FilterFieldConfig } from '@/components/filter';
import { GetBatchesInput } from '@repo/types';

export const BATCH_FILTERS_CONFIG: FilterFieldConfig<GetBatchesInput>[] = [
  {
    name: 'min_expiration_date',
    label: 'Validade Mín.',
    type: 'date',
    placeholder: 'dd/mm/aaaa',
  },
  {
    name: 'max_expiration_date',
    label: 'Validade Máx.',
    type: 'date',
    placeholder: 'dd/mm/aaaa',
  },
  {
    name: 'min_purchase_date',
    label: 'Data de Compra Mín.',
    type: 'date',
    placeholder: 'dd/mm/aaaa',
  },
  {
    name: 'max_purchase_date',
    label: 'Data de Compra Máx.',
    type: 'date',
    placeholder: 'dd/mm/aaaa',
  },
  {
    name: 'min_unit_cost_price',
    label: 'Preço de Custo Mín.',
    type: 'number',
    placeholder: 'Preço de custo mínimo',
  },
  {
    name: 'max_unit_cost_price',
    label: 'Preço de Custo Máx.',
    type: 'number',
    placeholder: 'Preço de custo máximo',
  },
  {
    name: 'min_current_quantity',
    label: 'Estoque Atual Mín.',
    type: 'number',
    placeholder: 'Mínimo em estoque',
  },
  {
    name: 'max_current_quantity',
    label: 'Estoque Atual Máx.',
    type: 'number',
    placeholder: 'Máximo em estoque',
  },
  {
    name: 'min_purchase_quantity',
    label: 'Estoque Comprado Mín.',
    type: 'number',
    placeholder: 'Estoque comprado mínimo',
  },
  {
    name: 'max_purchase_quantity',
    label: 'Estoque Comprado Máx.',
    type: 'number',
    placeholder: 'Estoque comprado máximo',
  },
];
