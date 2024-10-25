import { Injectable } from "@nestjs/common";
import { GetAttemptsResponseBindingModel } from "../../../common";
import { AttemptControlRepository } from "../../application";
import { RedisConfigService } from "./redis-config.service";

@Injectable()
export class RedisAdapterRepository implements AttemptControlRepository {
    constructor(private readonly redisConfigService: RedisConfigService) {}
    // Todo: Ajustar toda la logica de la peticion de los endpoints
    checkAttempts(requestType: string, key: string): Promise<GetAttemptsResponseBindingModel> {
        throw new Error("Method not implemented.");
    }
    deleteAttempt(requestType: string, key: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getAttempts(requestType: string, key: string): Promise<GetAttemptsResponseBindingModel> {
        throw new Error("Method not implemented.");
    }
}