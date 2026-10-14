

import { Types } from "mongoose";
import z from "zod";

export const createSubCategorySchema = z.strictObject({
    name: z.string().trim().min(2).max(50),
    image: z.string().optional(),
    category: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid category ID",
    }),
});

export type createSubCategoryDTO = z.infer<typeof createSubCategorySchema>;

export const updateSubCategorySchema = createSubCategorySchema.partial();

export type updateSubCategoryDTO = z.infer<typeof updateSubCategorySchema>;