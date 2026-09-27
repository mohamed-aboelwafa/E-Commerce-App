import { IsEmail, IsInt, IsString } from "class-validator";

export class CreateUserDto{
    @IsString()
    name: string

    @IsEmail()
    email: string

    @IsString()
    password: string

    @IsInt()
    age: number
}