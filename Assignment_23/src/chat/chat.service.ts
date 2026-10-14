import { Injectable } from "@nestjs/common";


@Injectable()
export class ChatService{
    hello_chat(){
        return "hello from chat module"
    }
}