import { IWallet } from "./interfaces";

export class Wallet implements IWallet {
    constructor(
        public id: string,
        public phoneNumber: string,
        public userId: string,
        public balance: number,
        public createAt: Date,
    ) {}
}