import { Body, Controller, Get, ParseIntPipe, Post, UsePipes } from "@nestjs/common";
import { UserService } from "./user.service.js";
import type{ Request } from "express";
import { CreateUserDto } from "./DTO/createUser.dto.js";
import { MyPipe1 } from "../common/pipes/pipe.js";
import { createUserBodySchema } from "./user.validation.js";
import type{ createUserDto_2 } from "./user.validation.js";

// http://localhost:3000/user
@Controller("/user")
export class UserController{
    constructor(
        private readonly userService: UserService
    ){}

    // http://localhost:3000/user/hello-user
    @Get("/hello-user")
    welcome_user(){
        return this.userService.hello_user()
    }

    // http://localhost:3000/user/receive_body_req
    @Get("/receive_body_req")
    receive_body_req(@Body() x:Request){
        console.log(x); // all body
        return this.userService.receive_body_req()
    }

    // http://localhost:3000/user/receive_specific_from_body_req
    @Get("/receive_specific_from_body_req")
    receive_specific_from_body_req(@Body("age") x:Request){
        console.log(x); // x carry age only from body request
        console.log(typeof(x));
        return this.userService.receive_body_req()
    }

    // http://localhost:3000/user/converting_coming_req
    @Get("/converting_coming_req")
    converting_coming_req(@Body("age", ParseIntPipe) x:Request){
        console.log(x); // x carry age only from body request
        console.log(typeof(x));
        return this.userService.converting_coming_req()
    }

    // http://localhost:3000/user/class_validation_test
    @Post("/class_validation_test")
    class_validation_test(@Body() body:CreateUserDto){
        return this.userService.class_validation_test()
    }

    // http://localhost:3000/user/custom_pipe_test
    @Post("/custom_pipe_test")
    @UsePipes(MyPipe1)
    custom_pipe_test(@Body() body:CreateUserDto){
        return this.userService.custom_pipe_test()
    }


    @Post("/standard_pipe_test")
    standard_pipe_test(
        @Body({
            schema: createUserBodySchema,
        })
        body:createUserDto_2){
        return this.userService.standard_pipe_test()
    }

}
