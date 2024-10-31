export class RegisterPaymentCommands {
    constructor(
        public readonly phoneNumber: string,
        public readonly discountValue: number
    ){}
}