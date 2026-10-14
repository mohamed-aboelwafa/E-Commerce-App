import { createParamDecorator } from "@nestjs/common"
import { HUser } from "../../User/types/user.type.js"
import { type Request } from "express"

export const User = createParamDecorator((data:keyof HUser, ctx)=>{
    // data --> ex: @Body("name")

    const req:Request = ctx.switchToHttp().getRequest()
    const user = req.user

    return data ? user[data] : user
})