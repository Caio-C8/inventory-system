import { FilterFieldConfig } from '@/components/filter';
import { ProductStatusFilter } from '@repo/types';

export const PRODUCT_STATUS_OPTIONS = [
  { label: 'Ativos', value: ProductStatusFilter.ACTIVE },
  { label: 'Removidos', value: ProductStatusFilter.DELETED },
  { label: 'Todos', value: ProductStatusFilter.ALL },
];

export const PRODUCT_FILTERS_CONFIG: FilterFieldConfig<any>[] = [
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    placeholder: 'Status do produto',
    options: PRODUCT_STATUS_OPTIONS,
  },
  {
    name: 'min_price',
    label: 'Preço Mín.',
    type: 'number',
    placeholder: 'Preço mínimo',
  },
  {
    name: 'max_price',
    label: 'Preço Máx.',
    type: 'number',
    placeholder: 'Preço máximo',
  },
  {
    name: 'min_stock',
    label: 'Estoque Mínimo',
    type: 'number',
    placeholder: 'Mínimo em estoque',
  },
  {
    name: 'max_stock',
    label: 'Estoque Máximo',
    type: 'number',
    placeholder: 'Máximo em estoque',
  },
];
