import { GetAttemptsResponseBindingModel } from "../../../common";

export abstract class AttemptControlRepository {
    abstract checkAttempts(requestType: string, key: string): Promise<GetAttemptsResponseBindingModel>;
    abstract deleteAttempt(requestType: string, key: string): Promise<boolean>;
    abstract getAttempts(requestType: string, key: string): Promise<GetAttemptsResponseBindingModel>;
}