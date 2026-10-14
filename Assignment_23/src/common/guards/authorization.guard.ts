import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import { HUser, RoleEnum } from "../../User/types/user.type.js";


@Injectable()
export class AuthorizationGuard implements CanActivate{
   constructor(
        private readonly reflactor: Reflector
   ){}

   async canActivate(context: ExecutionContext): Promise<boolean> {
        const user:HUser = context.switchToHttp().getRequest().user

        const roles = this.reflactor.getAllAndOverride<RoleEnum[]>("roles", [context.getHandler(), context.getClass()]) ?? []

        if(!roles.includes(user.role)){
            throw new ForbiddenException()    
        }

        return true
   }

}
