export class ConfirmPaymentCommand {
    constructor(
        public readonly phoneNumber: string,
        public readonly token: string,
        public readonly payment: number
    ) {}
}