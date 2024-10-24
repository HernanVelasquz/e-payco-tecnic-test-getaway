export abstract class HttpServiceRepository {
    abstract get(url: string): Promise<any>;
    abstract post<T>(url: string, data: T): Promise<any>;
}