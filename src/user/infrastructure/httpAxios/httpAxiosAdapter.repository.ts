import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { HttpServiceRepository } from "../../application";
import { lastValueFrom } from "rxjs";

@Injectable()
export class HttpAxiosAdapterRepository implements HttpServiceRepository {
    constructor(
        private readonly httpService: HttpService
    ) {}
    async getInformationUser<T>(url: string, token?: string): Promise<T> {
        const response = await lastValueFrom(this.httpService.get<T>(url));
        return response as T;
    }
    async post<T, F>(url: string, data: T): Promise<F> {
        const response = await lastValueFrom(this.httpService.post<F>(url, data));
        return response as F;
    }
}