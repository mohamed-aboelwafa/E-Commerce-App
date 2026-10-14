import z from "zod";

export const createBrandSchema = z.strictObject({
    name: z.string().trim().min(2).max(50),
    image: z.string().optional(),
});

export type createBrandDTO = z.infer<typeof createBrandSchema>;

export const updateBrandSchema = createBrandSchema.partial();

export type updateBrandDTO = z.infer<typeof updateBrandSchema>;