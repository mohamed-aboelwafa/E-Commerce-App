import z from "zod";

export const createCategorySchema = z.strictObject({
    name: z.string().trim().min(2).max(50),
    image: z.string().optional()
})

export type createCategoryDTO = z.infer<typeof createCategorySchema>

export const updateCategorySchema = createCategorySchema.partial()

export type updateCategoryDTO = z.infer<typeof updateCategorySchema>