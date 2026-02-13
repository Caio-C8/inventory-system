import { Product } from '@repo/types';
import { formatBrl } from '@repo/utils';
import Link from 'next/link';

export const PRODUCT_COLUMNS = [
  {
    header: 'Código',
    cell: (product: Product) => product.code,
  },
  {
    header: 'Nome',
    cell: (product: Product) => product.name,
  },
  {
    header: 'Preço de venda',
    cell: (product: Product) => formatBrl(product.sale_price),
  },
  {
    header: 'Código de barras',
    cell: (product: Product) => product.barcode,
  },
  {
    header: 'Quantidade em estoque',
    cell: (product: Product) => product.current_stock,
  },
  {
    header: '',
    cell: (product: Product) => (
      <Link href={`/products/${product.id}`} className="link">
        Ver mais
      </Link>
    ),
  },
];
