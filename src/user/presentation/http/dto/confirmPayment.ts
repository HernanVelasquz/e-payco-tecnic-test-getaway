import { IsNotEmpty, IsPositive, IsString } from "class-validator";

export class ConfirmPaymentDto {
    @IsString()
    @IsNotEmpty()
    public phoneNumber: string;
    @IsString()
    @IsNotEmpty()
    public token: string;
    @IsString()
    @IsPositive()
    @IsNotEmpty()
    public payment: number;
}