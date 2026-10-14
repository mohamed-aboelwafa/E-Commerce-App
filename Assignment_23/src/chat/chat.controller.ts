import { Controller, Get } from "@nestjs/common";
import { ChatService } from "./chat.service.js";


// http://localhost:3000/chat
@Controller("/chat")

export class ChatController{
    constructor(private readonly chatService: ChatService){}

    // http://localhost:3000/message/hello-chat
    @Get("/hello-chat")
    hello_chat(){
        return this.chatService.hello_chat()
    }
}