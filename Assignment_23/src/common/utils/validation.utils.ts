import { isValidObjectId } from "mongoose";
import z from "zod";

export const objectIdSchema =  z.string().refine((value)=>isValidObjectId(value),{error:"invalid id"})