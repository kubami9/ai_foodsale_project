import { z } from 'zod';

export const categorySchema = z.enum(['dairy', 'bakery', 'produce', 'pantry', 'meals']);
export type Category = z.infer<typeof categorySchema>;

export const catalogQuerySchema = z.strictObject({
  query: z.string().trim().max(100).default(''),
  category: categorySchema.optional(),
  available: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(12),
});
export type CatalogQuery = z.output<typeof catalogQuerySchema>;

export const sellerSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  city: z.string().min(1),
  description: z.string(),
});
export type Seller = z.infer<typeof sellerSchema>;

export const productSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  description: z.string(),
  category: categorySchema,
  priceGrosze: z.number().int().min(0),
  currency: z.literal('PLN'),
  unit: z.string().min(1),
  available: z.boolean(),
  seller: sellerSchema,
});
export type Product = z.infer<typeof productSchema>;

export const catalogPageSchema = z.object({
  items: z.array(productSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});
export type CatalogPage = z.infer<typeof catalogPageSchema>;
export const productIdSchema = z.uuid();

export const apiErrorSchema = z.object({
  ok: z.literal(false),
  error: z.object({ code: z.string(), message: z.string() }),
});
export function successSchema<T extends z.ZodType>(schema: T) {
  return z.object({ ok: z.literal(true), data: schema });
}
