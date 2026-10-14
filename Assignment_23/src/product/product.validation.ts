import z from "zod";
import { objectIdSchema } from "../common/utils/validation.utils.js";

export const createProductSchema = z.strictObject({
  name: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).optional(),
  price: z.number().min(0),
  discount: z.number().min(0).max(100).optional(),
  stock: z.number().min(0),
  category: objectIdSchema,
  subcategory: objectIdSchema,
  brand: objectIdSchema,
})

export type createProductDto = z.infer<typeof createProductSchema>

