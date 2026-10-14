import { Body, Controller, Get, HttpCode, ParseIntPipe, Patch, Post, Req, SetMetadata, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { CreateUserDto } from "./DTO/createUser.dto.js";
import { type confirmEmailDTO, confirmEmailSchema, signupSchema, type signupDTO, loginSchema, type loginDTO } from "./user.validation.js";
import { AuthGuard } from "../common/guards/auth.guard.js";
import type { Request } from "express";
import { User } from "../common/decorators/user.decorator.js";
import { RoleEnum, type HUser } from "./types/user.type.js";
import { Auth } from "../common/decorators/auth.decorator.js";
import { LoggingInterceptor } from "../common/interceptors/logging.interceptor.js";
import { UniformResInterceptor } from "../common/interceptors/UniformResInterceptor.js";
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express';
import type {Express} from 'express';
import { uploadFile } from "../common/utils/multer.options.js";

// http://localhost:3000/user
@Controller("/user")
@SetMetadata("roles",[RoleEnum.user]) // class
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

    // http://localhost:3000/user/authentication-get-profile
    @Get("/authentication-get-profile")
    @UseGuards(AuthGuard)
    authentication_get_profile(@User("name") user:HUser){
        return {
            data:{user}
        }
    }

    // http://localhost:3000/user/authorization-get-profile
    @Get("/authorization-get-profile")
    @Auth(RoleEnum.admin)
    authorization_get_profile(@User() user:HUser){
        return {
            data:{user}
        }
    }

    // http://localhost:3000/user/test-interceptor
    @Get("/test-interceptor")
    @Auth()
    @UseInterceptors(LoggingInterceptor)
    async test_interceptor(@User() user: HUser){
        console.log("handler")
        return {
            data:{}
        }
    }


    // http://localhost:3000/user/UniformResInterceptor
    @Get("/UniformResInterceptor")
    @Auth()
    @UseInterceptors(UniformResInterceptor)
    async UniformResInterceptor(@User() user: HUser){
        console.log("handler")
        return {
            data:{}
        }
    }

    @Post("/uplaod-single-file")
    @UseInterceptors(FileInterceptor('image'))
    uplaod_single_file(@UploadedFile() file:Express.Multer.File){
        console.log({file})
        return {
            data: {
                file
            }
        }
    }

    @Post("/uplaod-mult-files")
    @UseInterceptors(FilesInterceptor('image'))
    uplaod_multiple_files(@UploadedFiles() file:Express.Multer.File[]){
        console.log({file})
        return {
            data: {
                file
            }
        }
    }


    @Post("/uplaod-file-in-disk")
    @UseInterceptors(FileInterceptor('image',uploadFile({})))
    uplaod_file_in_disk(@UploadedFiles() file:Express.Multer.File[]){
        console.log({file})
        return {
            data: {
                file
            }
        }
    }


}
 