import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class RegisterPaymentDto {
    @IsNotEmpty()
    @IsString()
    phoneNumber: string

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    discountValue: number;
}