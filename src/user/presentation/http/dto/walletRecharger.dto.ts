import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class WalletRecharger {
    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    documentNumber: string;

    @IsNumber()
    @IsNotEmpty()
    mountRecharger: number;
}