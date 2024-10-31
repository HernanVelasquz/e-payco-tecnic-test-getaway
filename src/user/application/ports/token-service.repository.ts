export abstract class TokenServiceRepository {
    public abstract generateToken(): Promise<number>;
    public abstract validateToken(sendToken: string, tokenRedis: string): boolean;
}