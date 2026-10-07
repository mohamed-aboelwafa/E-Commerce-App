
// ENCRYPTION_SECRET = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"


import { BadRequestException, Injectable } from "@nestjs/common"
import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

@Injectable()
export class EncryptionService{

    private readonly key: Buffer
    private readonly algorithm = "aes-256-gcm"

    constructor(){
        this.key = Buffer.from(process.env.ENCRYPTION_SECRET!, "hex")
    }

    encrypt(plainText: string): string{
        const iv = randomBytes(12)
        const cipher = createCipheriv(
            this.algorithm,
            this.key,
            iv
        )
        const encrypted = Buffer.concat([
            cipher.update(plainText, "utf-8"),
            cipher.final()
        ])

        const authTag = cipher.getAuthTag();

        return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
    }

    decrypt(payload: string){
        const parts = payload.split(":");

        if(parts.length!=3){
            throw new BadRequestException("invalid encrypted payload")
        }

        const [iv, authTag, encrypted] = parts.map(ele => Buffer.from(ele, "hex"))

        try{
            const decipher = createDecipheriv(this.algorithm, this.key, iv)
            decipher.setAuthTag(authTag)

            return Buffer.concat([
                decipher.update(encrypted),
                decipher.final()
            ]).toString("utf-8")
        } catch(err){
            throw new BadRequestException("decrypt feild: wrong key insert")
        }
    }


}
