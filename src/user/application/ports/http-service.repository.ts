export abstract class HttpServiceRepository {
    abstract getInformationUser<T>(url: string, token?:string): Promise<T>;
    abstract post<T, F>(url: string, data: T): Promise<F>;
}