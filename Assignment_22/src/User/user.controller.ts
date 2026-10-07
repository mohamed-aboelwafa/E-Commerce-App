import { Body, Controller, Get, HttpCode, ParseIntPipe, Patch, Post, Req, UseGuards, UsePipes } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { CreateUserDto } from "./DTO/createUser.dto.js";
import { type confirmEmailDTO, confirmEmailSchema, signupSchema, type signupDTO, loginSchema, type loginDTO } from "./user.validation.js";
import { AuthGuard } from "../common/guards/auth.guard.js";
import type { Request } from "express";
import { User } from "../common/decorators/user.decorator.js";
import { type HUser } from "./types/user.type.js";

// http://localhost:3000/user
@Controller("/user")
export class UserController{
    constructor(
        private readonly userService: UserService
    ){}

    // http://localhost:3000/user/create-user
    @Post("/create-user")
    create_user(@Body() body:CreateUserDto){
        return this.userService.create_user(body)
    }

    // http://localhost:3000/user/get-all-users
    @Get("/get-all-users")
    get_all_users(){
        return this.userService.get_all_users()
    }

    // http://localhost:3000/user/signup
    @Post("/signup")
    @HttpCode(201) // to send status code with res
    signup(@Body({schema: signupSchema}) body: signupDTO){
        return {body}
    }

    // http://localhost:3000/user/hash_and_compare_test
    @Get("/hash_and_compare_test")
    hash_and_compare_test(){
        return this.userService.hash_and_compare_test()
    }

    // http://localhost:3000/user/encryption_and_decryption_test
    @Get("/encryption_and_decryption_test")
    encryption_and_decryption_test(){
        return this.userService.encryption_and_decryption_test()
    }

    // http://localhost:3000/user/confirm-email
    @Patch("/confirm-email")
    @HttpCode(200)
    async confirmEmail(@Body({
        schema: confirmEmailSchema
    }) body:confirmEmailDTO){
        const {data} = await this.userService.confirmEmail(body);

        return {
            data
        }
    }


    // http://localhost:3000/user/login
    @Post("/login")
    @HttpCode(200)
    async login(@Body({schema: loginSchema}) body:loginDTO){
        const {data} = await this.userService.login(body)

        return {
            data
        }
    }

    // http://localhost:3000/user/get-profile
    @Get("/get-profile")
    @UseGuards(AuthGuard)
    guard_test(@User("name") user:HUser){
        return {
            data:{user}
        }
    }

}
 