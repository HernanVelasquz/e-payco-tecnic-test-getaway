import { Injectable } from "@nestjs/common";
import { GetAttemptsResponseBindingModel } from "../../../common";
import { AttemptControlRepository } from "../../application";

@Injectable()
export class RedisAdapterRepository implements AttemptControlRepository {
    constructor() {}
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