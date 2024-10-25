import { Injectable } from "@nestjs/common";
import { Wallet } from "../wallet";
import { v4 as UUID} from 'uuid';
@Injectable()
export class WalletFactory {
    create(
        phoneNumber: string,
        userId: string,
    ) {
        return new Wallet(UUID(), phoneNumber, userId, 0, new Date());
    }
}