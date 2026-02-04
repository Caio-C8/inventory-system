import { z } from "zod";
import { Customer } from "./customer";
import { PaginationSchema } from "./pagination";

export enum SaleStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  IN_DELIVERY = "IN_DELIVERY",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
  RETURNED = "RETURNED",
}

export interface Sale {
  id: number;
  status: SaleStatus;
  channel: string;
  total_value: number;
  sale_date: Date;
  customer_id: number;
}

export interface SaleItem {
  id: number;
  unit_cost_snapshot: number;
  quantity: number;
  unit_sale_price: number;
  product_id: number;
  sale_id: number;
}

export interface AllocationSaleItem {
  id: number;
  quantity: number;
  sale_item_id: number;
  batch_id: number;
}

export type SaleWithItems = Sale & {
  saleItems: SaleItem[];
};

export type CompleteSale = Sale & {
  customer: Customer;
  saleItems: SaleItem[];
};

export type SaleItemWithAllocations = SaleItem & {
  batchAllocations: AllocationSaleItem[];
};

export type SaleWithAllocations = Sale & {
  saleItems: Array<SaleItemWithAllocations>;
};

export type SaleItemWithRelations = SaleItem & {
  batchAllocations: AllocationSaleItem[];
  sale: Sale;
};

export interface StockAllocationResult {
  product_id: number;
  quantity_requested: number;
  unit_cost_snapshot: number;
  allocations: Array<{
    batch_id: number;
    quantity: number;
  }>;
}

export interface SalesReportMetric {
  channel: string;
  count: number;
  total_revenue: number;
  total_cost: number;
  total_profit: number;
}

export interface SalesReportResponse {
  period: {
    start: Date;
    end: Date;
  };
  by_channel: SalesReportMetric[];
  grand_total: SalesReportMetric;
}

export const CreateSaleItemSchema = z.object({
  product_id: z.coerce
    .number({
      invalid_type_error: "ID do produto inválido.",
      required_error: "Selecione um produto.",
    })
    .int()
    .gte(1, { message: "Informe um ID de produto válido." }),

  quantity: z.coerce
    .number({
      invalid_type_error: "Quantidade inválida.",
      required_error: "Preencha o campo quantidade.",
    })
    .int()
    .gte(1, { message: "A quantidade deve ser maior do que 0." }),

  unit_sale_price: z.coerce
    .number({
      invalid_type_error: "Preço de venda inválido.",
      required_error: "Preencha o campo preço de venda unitário.",
    })
    .gte(0.01, { message: "O preço de venda deve ser maior que 0." }),
});

export const CreateSaleSchema = z.object({
  total_value: z.coerce
    .number({
      invalid_type_error: "Valor total inválido.",
    })
    .gte(0.01, { message: "O valor total deve ser maior que 0." })
    .optional()
    .default(0),

  channel: z
    .string({
      invalid_type_error: "Forma da venda inválida.",
      required_error: "Preencha o campo forma de venda.",
    })
    .min(1, { message: "Preencha o campo forma de venda." }),

  sale_date: z.coerce
    .date({
      invalid_type_error: "Data de venda inválida.",
      required_error: "Preencha o campo data de venda.",
    })
    .min(new Date("1990-01-01"), {
      message: "A data de venda não pode ser muito antiga.",
    })
    .max(new Date(), {
      message: "A data de venda não pode ultrapassar a data atual.",
    }),

  status: z.nativeEnum(SaleStatus, {
    required_error: "O status é obrigatório.",
  }),

  customer_id: z.coerce
    .number({
      invalid_type_error: "ID do cliente inválido.",
      required_error: "Selecione um cliente.",
    })
    .int()
    .gte(1, { message: "Informe um ID de cliente válido." }),

  saleItems: z
    .array(CreateSaleItemSchema)
    .min(1, { message: "A venda deve ter pelo menos um item." }),
});

export const UpdateSaleSchema = CreateSaleSchema.partial().omit({
  saleItems: true,
});

export const UpdateSaleItemSchema = CreateSaleItemSchema.partial().extend({
  unit_cost_snapshot: z.coerce
    .number({
      invalid_type_error: "ID do cliente inválido.",
    })
    .gte(0.01, { message: "O valor de custo deve ser maior do que 0." })
    .optional(),
});

const GetSalesParams = z.object({
  search: z.string().optional(),

  status: z.nativeEnum(SaleStatus).optional(),

  min_sale_date: z.coerce
    .date()
    .min(new Date("1990-01-01"))
    .max(new Date())
    .optional(),

  max_sale_date: z.coerce
    .date()
    .min(new Date("1990-01-01"))
    .max(new Date())
    .optional(),

  min_total_value: z.coerce.number().gte(0.01).optional(),
  max_total_value: z.coerce.number().gte(0.01).optional(),

  channel: z.string().optional(),
});

export const GetSalesSchema = PaginationSchema.merge(GetSalesParams);

export const GetSalesForReportSchema = z.object({
  start_date: z.coerce.date().min(new Date("1990-01-01")).max(new Date()),
  end_date: z.coerce.date().min(new Date("1990-01-01")).max(new Date()),

  channel: z
    .string()
    .optional()
    .transform((value) => (value ? value.toUpperCase() : undefined)),
});

export const SaleItemInternalSchema = z.object({
  product_id: z.number(),
  quantity: z.number(),
  unit_sale_price: z.number(),
  unit_cost_snapshot: z.number(),
  allocations: z.array(
    z.object({
      batch_id: z.number(),
      quantity: z.number(),
    }),
  ),
});

export const SaleInternalCreateSchema = z.object({
  channel: z.string(),
  sale_date: z.coerce.date(),
  status: z.nativeEnum(SaleStatus),
  customer_id: z.number(),
  total_value: z.number(),
  items: z.array(SaleItemInternalSchema),
});

export type CreateSaleInput = z.infer<typeof CreateSaleSchema>;
export type UpdateSaleInput = z.infer<typeof UpdateSaleSchema>;
export type UpdateSaleItemInput = z.infer<typeof UpdateSaleItemSchema>;
export type GetSalesInput = z.infer<typeof GetSalesSchema>;
export type CreateSaleItemInput = z.infer<typeof CreateSaleItemSchema>;
export type GetSalesForReportInput = z.infer<typeof GetSalesForReportSchema>;

export type SaleItemInternal = z.infer<typeof SaleItemInternalSchema>;
export type SaleInternalCreate = z.infer<typeof SaleInternalCreateSchema>;
