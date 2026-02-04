import { z } from "zod";
import { Batch } from "./batch";
import { PaginationSchema } from "./pagination";

export interface Product {
  id: number;
  name: string;
  code: string;
  barcode: string;
  name_search: string;
  sale_price: number;
  current_stock: number;
  deleted_at?: Date;
  batches?: Batch[];
}

export enum ProductStatusFilter {
  ACTIVE = "active",
  DELETED = "deleted",
  ALL = "all",
}

export const CreateProductSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Nome inválido.",
      required_error: "Preencha o campo nome.",
    })
    .min(1, { message: "Preencha o campo nome." }),

  code: z
    .string({
      invalid_type_error: "Código inválido.",
      required_error: "Preencha o campo código.",
    })
    .min(1, { message: "Preencha o campo código." }),

  barcode: z
    .string({
      invalid_type_error: "Código de barras inválido.",
      required_error: "Preencha o campo código de barras.",
    })
    .min(1, { message: "Preencha o campo código de barras." }),

  sale_price: z.coerce
    .number({
      invalid_type_error: "Preço inválido.",
      required_error: "Preencha o campo preço de venda.",
    })
    .gte(0.01, { message: "O preço deve ser maior do que 0." }),
});

export const UpdateProductSchema = CreateProductSchema.partial();

const GetProductsParams = z.object({
  search: z.string().optional(),

  status: z
    .nativeEnum(ProductStatusFilter)
    .optional()
    .default(ProductStatusFilter.ACTIVE),

  min_price: z.coerce.number().gte(0.01).optional(),
  max_price: z.coerce.number().gte(0.01).optional(),

  min_stock: z.coerce.number().int().gte(1).optional(),
  max_stock: z.coerce.number().int().gte(1).optional(),
});

export const GetProductsSchema = PaginationSchema.merge(GetProductsParams);

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type GetProductsInput = z.infer<typeof GetProductsSchema>;
