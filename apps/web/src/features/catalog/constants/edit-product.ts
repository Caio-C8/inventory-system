import { EditFieldConfig } from '@/components/edit-modal';
import { UpdateProductInput } from '@repo/types';

export const EDIT_PRODUCT_CONFIG: EditFieldConfig<UpdateProductInput>[] = [
  {
    name: 'code',
    label: 'Código',
    type: 'text',
    placeholder: 'Código do produto',
  },
  {
    name: 'name',
    label: 'Nome',
    type: 'text',
    placeholder: 'Nome do produto',
  },
  {
    name: 'sale_price',
    label: 'Preço de venda',
    type: 'currency',
    placeholder: 'Preço de venda do produto',
  },
  {
    name: 'barcode',
    label: 'Código de barras',
    type: 'text',
    placeholder: 'Código de barras do produto',
  },
];
