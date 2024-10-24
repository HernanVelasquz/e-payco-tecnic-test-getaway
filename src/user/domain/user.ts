import { IUser } from "./interfaces";

export class User implements IUser {
    id: string;
    typeDocument: string;
    numberDocument: string;
    fullName: string;
    email: string;
    phoneNumber: string;
}