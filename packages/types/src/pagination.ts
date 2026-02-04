import { z } from "zod";

export const PaginationSchema = z.object({
  page: z.coerce.number().gte(1).optional().default(1),
  limit: z.coerce.number().gte(1).optional().default(10),
});

export type PaginationInput = z.infer<typeof PaginationSchema>;

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    last_page: number;
    limit: number;
  };
}
