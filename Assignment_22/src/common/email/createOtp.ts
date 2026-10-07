
import {customAlphabet} from "nanoid";

export const createOtp = ()=>{
    return customAlphabet("0123456789",6)(6)
}

