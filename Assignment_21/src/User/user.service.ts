import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService{
    hello_user(){
        return "hello worlld"
    }

    receive_body_req(){
        return "check console"
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