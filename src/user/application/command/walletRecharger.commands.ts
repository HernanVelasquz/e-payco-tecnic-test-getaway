export class WalletRechargerCommands {
    constructor(
        public readonly phoneNumber: string,
        public readonly documentNumber: string,
        public readonly mountRecharger: number,
    ){}
}