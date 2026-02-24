import { EditModal } from '@/components/edit-modal';
import { Product, UpdateProductSchema } from '@repo/types';
import { formatBrl } from '@repo/utils';
import Link from 'next/link';
import {
  useDeleteProduct,
  useRestoreProduct,
  useUpdateProduct,
} from '../hooks/use-products';
import { EDIT_PRODUCT_CONFIG } from '../constants/edit-product';

const EditProductActionCell = ({ product }: { product: Product }) => {
  const { mutate: updateFn, isPending: isPendingSave } = useUpdateProduct(
    product.id,
  );

  const { mutate: deleteFn, isPending: isPendingDelete } = useDeleteProduct(
    product.id,
  );

  const { mutate: restoreFn, isPending: isPendingRestore } = useRestoreProduct(
    product.id,
  );

  return (
    <EditModal
      title="Editar produto"
      entity={product}
      fields={EDIT_PRODUCT_CONFIG}
      schema={UpdateProductSchema}
      onSave={async (data) => {
        await updateFn(data);
      }}
      isPendingSave={isPendingSave}
      onDelete={async () => {
        await deleteFn();
      }}
      isPendingDelete={isPendingDelete}
      onRestore={async () => {
        await restoreFn();
      }}
      isPendingRestore={isPendingRestore}
    />
  );
};

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
    header: 'Status',
    cell: (product: Product) => (product.deleted_at ? 'Removido' : 'Ativo'),
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

export const PRODUCT_DETAIL_COLUMN = [
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
    header: 'Estoque atual',
    cell: (product: Product) => product.current_stock,
  },
  {
    header: 'Status',
    cell: (product: Product) => (product.deleted_at ? 'Removido' : 'Ativo'),
  },
  {
    header: '',
    cell: (product: Product) => <EditProductActionCell product={product} />,
  },
];
