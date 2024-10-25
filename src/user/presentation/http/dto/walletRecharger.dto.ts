import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class WalletRecharger {
    @IsNotEmpty()
    @IsString()
    typeSearch: string;

    @IsNumber()
    @IsNotEmpty()
    mountRecharger: number;
}