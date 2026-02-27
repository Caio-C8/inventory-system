import { z } from "zod";
import { PaginationSchema } from "./pagination";
import { Product } from "./product";

export interface Batch {
  id: number;
  tax_invoice_number: string;
  unit_cost_price: number;
  expiration_date: Date;
  purchase_date: Date;
  current_quantity: number;
  purchase_quantity: number;
  product_id: number;
}

export type BatchWithProduct = Batch & {
  product: Product;
};

export const CreateBatchSchema = z.object({
  tax_invoice_number: z
    .string({
      invalid_type_error: "Número da nota fiscal inválida.",
      required_error: "Preencha o campo número da nota fiscal.",
    })
    .min(1, { message: "Preencha o campo número da nota fiscal." }),

  unit_cost_price: z.coerce
    .number({
      invalid_type_error: "Preço unitário inválido.",
      required_error: "Preencha o campo preço unitário.",
    })
    .gte(0.01, { message: "O preço de custo deve ser maior do que 0." }),

  expiration_date: z.coerce
    .date({
      invalid_type_error: "Data de validade inválida.",
      required_error: "Preencha o campo data de validade.",
    })
    .min(new Date("1990-01-01"), {
      message: "A data de validade não pode ser muito antiga.",
    }),

  purchase_date: z.coerce
    .date({
      invalid_type_error: "Data de compra inválida.",
      required_error: "Preencha o campo data de compra.",
    })
    .min(new Date("1990-01-01"), {
      message: "A data de compra não pode ser muito antiga.",
    })
    .max(new Date(), {
      message: "A data de compra não pode ultrapassar a data atual.",
    }),

  purchase_quantity: z
    .number({
      invalid_type_error: "Quantidade comprada inválida.",
      required_error: "Preencha o campo quantidade comprada.",
    })
    .gte(1, { message: "A quantidade comprada deve ser maior do que 0." }),

  product_id: z
    .number({
      invalid_type_error: "ID do produto inválido.",
      required_error: "Preencha o campo produto.",
    })
    .gte(1, { message: "O ID do produto deve ser maior do que 0." }),
});

export const UpdateBatchSchema = CreateBatchSchema.partial().extend({
  current_quantity: z.coerce
    .number({ invalid_type_error: "Quantidade atual inválida." })
    .int()
    .gte(0, { message: "A quantidade atual não pode ser menor do que 0." })
    .optional(),
});

const GetBatchesParams = z.object({
  search: z.string().optional(),

  min_expiration_date: z.coerce
    .date()
    .min(new Date("1990-01-01"))
    .max(new Date())
    .optional(),

  max_expiration_date: z.coerce
    .date()
    .min(new Date("1990-01-01"))
    .max(new Date())
    .optional(),

  min_purchase_date: z.coerce
    .date()
    .min(new Date("1990-01-01"))
    .max(new Date())
    .optional(),

  max_purchase_date: z.coerce
    .date()
    .min(new Date("1990-01-01"))
    .max(new Date())
    .optional(),

  min_unit_cost_price: z.coerce.number().gte(0.01).optional(),
  max_unit_cost_price: z.coerce.number().gte(0.01).optional(),

  min_current_quantity: z.coerce.number().int().gte(0).optional(),
  max_current_quantity: z.coerce.number().int().gte(0).optional(),

  min_purchase_quantity: z.coerce.number().int().gte(0).optional(),
  max_purchase_quantity: z.coerce.number().int().gte(0).optional(),
});

export const GetBatchesSchema = PaginationSchema.merge(GetBatchesParams);

export type CreateBatchInput = z.infer<typeof CreateBatchSchema>;
export type UpdateBatchInput = z.infer<typeof UpdateBatchSchema>;
export type GetBatchesInput = z.infer<typeof GetBatchesSchema>;
