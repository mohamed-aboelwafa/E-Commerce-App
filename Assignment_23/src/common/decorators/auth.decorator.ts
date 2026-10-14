
// merging many decorators in one decorator

import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common"
import { AuthGuard } from "../guards/auth.guard.js"
import { AuthorizationGuard } from "../guards/authorization.guard.js"
import { RoleEnum } from "../../User/types/user.type.js"

export const Auth = (...roles: RoleEnum[])=>{
    return applyDecorators(
        SetMetadata("roles", roles),
        UseGuards(AuthGuard),
        UseGuards(AuthorizationGuard)
    )
}
