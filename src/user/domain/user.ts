import { IUser } from "./interfaces";

export class User implements IUser {
    constructor(
        public id: string,
        public typeDocument: string,
        public numberDocument: string,
        public fullName: string,
        public email: string,
        public phoneNumber: string,
    ) {}
}