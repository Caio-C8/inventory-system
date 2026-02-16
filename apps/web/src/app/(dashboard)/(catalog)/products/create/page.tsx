import { Card } from '@/components/ui/card';
import { CreateProductForm } from '@/features/catalog/components/create-product-form';

export default function CreateProduct() {
  return (
    <div className="flex flex-col gap-[65px] items-center">
      <h1 className="text-center text-4xl">Cadastrar Produto</h1>

      <Card className="p-5">
        <CreateProductForm />
      </Card>
    </div>
  );
}
