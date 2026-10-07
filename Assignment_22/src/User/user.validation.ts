import z from 'zod';
import { GenderEnum } from './types/user.type.js';




// signup validation
export const signupSchema = z.strictObject({
    name: z.string(),
    age: z.number().optional(),
    email: z.email(),
    password: z.string().regex(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_-])(?=.*[0-9]).{8,}$/)),
    bio: z.string().optional(),
    gender: z.enum(GenderEnum),
    phone: z.string().optional(),
})
export type signupDTO = z.infer<typeof signupSchema>



// confirmEmail validation
export const confirmEmailSchema = z.strictObject({
    email: z.email(),
    otp: z.string().length(6)
})

export type confirmEmailDTO = z.infer<typeof confirmEmailSchema>



// login validation
export const loginSchema = z.strictObject({
    email: z.email(),
    password: z.string(),
})

export type loginDTO = z.infer<typeof loginSchema>



