import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common"
import { CategoryService } from "./category.service.js"
import { Auth } from "../common/decorators/auth.decorator.js"
import { type HUser, RoleEnum } from "../User/types/user.type.js"
import { User } from "../common/decorators/user.decorator.js"
import { type createCategoryDTO, createCategorySchema } from "./category.validation.js"

@Controller("/categories")
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    @Auth(RoleEnum.admin)
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body({schema: createCategorySchema}) body: createCategoryDTO,
        @User() user: HUser
    ) {
        const {data} = await this.categoryService.create(body, user)
        return {
            data
        }
    }

    @Get()
    async findAll(){
        const {data} = await this.categoryService.findAll()
        return {

        }
    }
}
