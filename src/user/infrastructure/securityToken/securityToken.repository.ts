import { Injectable } from "@nestjs/common";
import { TokenServiceRepository } from "../../application";
import * as crypto from 'crypto';

@Injectable()
export class SecurityTokenAdapter implements TokenServiceRepository {

    public async generateToken(): Promise<number> {
        return crypto.randomInt(100000, 999999)
    }
    public validateToken(sendToken: string, tokenRedis: string): boolean {
        throw new Error("Method not implemented.");
    }
}