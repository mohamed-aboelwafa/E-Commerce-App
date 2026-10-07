import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../common/models/user.model.js";
import { Model } from "mongoose";
import { CreateUserDto } from "../User/DTO/createUser.dto.js";

@Injectable()
export class UserService{
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>
    ){}

    hello_user(){
        return "hello worlld"
    }

    test1(body:any){
        console.log("hello from service");
        console.log("body from service --> ",body);
        return "return value of service"
    }

    receive_body_req(){
        return "check console"
    }

    log_coming_req(body:any){
        console.log("this is body --> ", body);
        return "check coming req";
    }

    receive_specific_from_body_req(){
        return "check console"
    }

    converting_coming_req(){
        return "check console"
    }

    class_validation_test(){
        return "class validation successed"
    }

    custom_pipe_test(){
        return "custom pipe test"
    }

    standard_pipe_test(){
        return "standard pipe test"
    }
}