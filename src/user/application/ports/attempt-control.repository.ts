export abstract class AttemptControlRepository {
    abstract setCache(requestType: string, key: string): Promise<void>;
    abstract deleteCache(key: string): Promise<void>;
    abstract getCache(key: string): Promise<string>;
}