export abstract class HttpServiceRepository {
    abstract getInformation<T>(url: string, token?:string): Promise<T>;
    abstract post<T, F>(url: string, data: T): Promise<F>;
}