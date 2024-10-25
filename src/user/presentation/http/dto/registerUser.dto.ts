import {IsString, IsNotEmpty, MaxLength, MinLength} from 'class-validator'
import { IUser } from "../../../domain";


export class RegisterUserDto implements IUser{
    @IsString()
    @IsNotEmpty()
    @MaxLength(2)
    typeDocument: string;
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    numberDocument: string;
    @IsString()
    @IsNotEmpty()
    fullName: string;
    @IsString()
    @IsNotEmpty()
    email: string;
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    @MinLength(7)
    phoneNumber: string;

}