import { Module } from "@nestjs/common";
import { UserController } from "./user.controller.js";
import { UserService } from "./user.service.js";
import { UserModel } from "../common/models/user.model.js";
import { SecurityModule } from "../common/security/security.module.js";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [UserModel, SecurityModule, JwtModule],
    controllers:[UserController],
    providers: [UserService],
})



export class UserModule{}
