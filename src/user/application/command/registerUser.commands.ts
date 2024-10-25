export class RegisterUserCommand {
    constructor(
        public readonly typeDocument: string,
        public readonly numberDocument: string,
        public readonly fullName: string,
        public readonly email: string,
        public readonly phoneNumber: string,
    ) {}
}