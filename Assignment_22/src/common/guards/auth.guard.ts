import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { HUser, JwtPayload } from "../../User/types/user.type.js"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import {Request} from "express";
import {Observable} from "rxjs";
import { User } from "../models/user.model.js"



declare module "express-serve-static-core"{
    interface Request{
        user: HUser
    }
}


@Injectable()
export class AuthGuard implements CanActivate{

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @InjectModel(User.name) private readonly userModel: Model<User>
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try{
            // extract req
            const req:Request = context.switchToHttp().getRequest()

            //console.log("guard started...");
            //console.log({token: req.headers.authorization})

            // extract authorization from req.headers , and check if authorization exists or startsWith Bearer
            const authorization = req.headers.authorization
            if(!authorization || !authorization.startsWith("Bearer")){
                throw new UnauthorizedException()
            }

            // extract token from authorization
            const token = authorization.split(" ")[1]
            if(!token){
                throw new UnauthorizedException()
            }

            // extract payload from token
            const payload:JwtPayload = await this.jwtService.verifyAsync<JwtPayload>(token, {
                secret: this.configService.get<string>("TOKEN_SECRET")
            })

            
            // check if user exists
            const user = await this.userModel.findById(payload._id)
            if(!user){
                throw new UnauthorizedException()
            }
            if(!user.confirmedAt){
                throw new UnauthorizedException()
            }

            req.user = user

            return true
        }catch(error:any){
            throw new UnauthorizedException(error.message)
        }
    }
}