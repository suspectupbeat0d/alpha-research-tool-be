import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignupDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    contactNo: any
    avatar: any
    cover: any
}

export class LoginDto {
    @IsEmail()
    email: string;
    
    password: string;
    metamaskId: string;
}

export class verifyCodeDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    pin: number;
}
export class forgetPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
export class validateEmailUsernameDto {
    @IsString()
    identifier: string;
}