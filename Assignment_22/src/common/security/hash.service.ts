import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class HashService {
    private readonly saltRounds = 10;

    async hash(plainText: string): Promise<string> {
        return await bcrypt.hash(plainText, this.saltRounds);
    }

    async compare(plainText: string, hashed: string): Promise<boolean> {
        return await bcrypt.compare(plainText, hashed);
    }
}