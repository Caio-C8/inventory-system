import { z } from "zod";
import { PaginationSchema } from "./pagination";

export type Customer = {
  id: number;
  name: string;
  name_search: string;
  birth_date?: Date;
  contact_info?: string;
  deleted_at?: Date;
};

export enum CustomerStatusFilter {
  ACTIVE = "active",
  DELETED = "deleted",
  ALL = "all",
}

export const CreateCustomerSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Nome inválido.",
      required_error: "Preencha o campo nome.",
    })
    .min(1, { message: "Preecha o campo nome." }),

  name_search: z
    .string({
      invalid_type_error: "Nome inválido.",
      required_error: "Preencha o campo nome.",
    })
    .min(1, { message: "Preecha o campo nome." }),

  birth_date: z.coerce
    .date({
      invalid_type_error: "Data inválida.",
      required_error: "Preencha o campo data de aniversário.",
    })
    .min(new Date("1900-01-01"), {
      message: "A data de aniversário não deve ser muito antiga.",
    })
    .max(new Date(), {
      message: "A data de compra não pode ultrapassar a data atual.",
    }),

  contact_info: z
    .string({
      invalid_type_error: "Informações de contato inválidas.",
      required_error: "Preencha o campo informações de contato.",
    })
    .min(1, { message: "Preecha o campo informações de contato." }),
});

export const UpdateCustomerSchema = CreateCustomerSchema.partial();

const GetCustomersParams = z.object({
  search: z.string().optional(),

  status: z
    .nativeEnum(CustomerStatusFilter)
    .optional()
    .default(CustomerStatusFilter.ACTIVE),

  min_birth_date: z.coerce
    .date()
    .min(new Date("1990-01-01"))
    .max(new Date())
    .optional(),

  max_birth_date: z.coerce
    .date()
    .min(new Date("1990-01-01"))
    .max(new Date())
    .optional(),
});

export const GetCustomersSchema = PaginationSchema.merge(GetCustomersParams);

export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerSchema>;
export type GetCustomersInput = z.infer<typeof GetCustomersSchema>;
