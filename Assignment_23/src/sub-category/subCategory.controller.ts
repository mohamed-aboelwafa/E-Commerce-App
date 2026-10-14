import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { type HUser, RoleEnum } from "../User/types/user.type.js";
import { Auth } from "../common/decorators/auth.decorator.js";
import { User } from "../common/decorators/user.decorator.js";
import { SubCategoryService } from "./subCategory.service.js";
import { type createSubCategoryDTO, createSubCategorySchema, type updateSubCategoryDTO, updateSubCategorySchema } from "./subCategory.validation.js";

@Controller("sub-categories")
export class SubCategoryController {
    constructor(private readonly subCategoryService: SubCategoryService) {}

    @Post()
    @Auth(RoleEnum.admin)
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body({ schema: createSubCategorySchema }) body: createSubCategoryDTO,
        @User() user: HUser
    ){
        const { data } = await this.subCategoryService.create(body, user);
        return { data };
    }

    @Get()
    async findAll(@Query("category") category?: string){
        const { data } = await this.subCategoryService.findAll(category);
        return { data };
    }

    @Get(":id")
    async findOne(@Param("id") id: string){
        const { data } = await this.subCategoryService.findOne(id);
        return { data };
    }

    @Put(":id")
    @Auth(RoleEnum.admin)
    async update(
        @Param("id") id: string,
        @Body({ schema: updateSubCategorySchema }) body: updateSubCategoryDTO
    ){
        const { data } = await this.subCategoryService.update(id, body);
        return { data };
    }
}


// import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from "@nestjs/common";
// import { SubCategoryService } from "./subCategory.service.js";
// import { createSubCategorySchema, createSubCategoryDTO, updateSubCategorySchema, updateSubCategoryDTO } from "./subCategory.validation.js";
// import { Auth } from "../common/decorators/auth.decorator.js";
// import { RoleEnum } from "../User/types/user.type.js";
// import { User } from "../common/decorators/user.decorator.js";
// import { HUser } from "../User/types/user.type.js";

// @Controller("/sub-categories")
// export class SubCategoryController {
//     constructor(private readonly subCategoryService: SubCategoryService) {}

//     @Post()
//     @Auth(RoleEnum.admin)
//     @HttpCode(HttpStatus.CREATED)
//     async create(
//         @Body({ schema: createSubCategorySchema }) body: createSubCategoryDTO,
//         @User() user: HUser
//     ) {
//         const { data } = await this.subCategoryService.create(body, user);
//         return { data };
//     }

//     @Get()
//     async findAll() {
//         return await this.subCategoryService.findAll();
//     }

//     @Get(":id")
//     async findOne(@Param("id") id: string) {
//         return await this.subCategoryService.findOne(id);
//     }

//     @Put(":id")
//     @Auth(RoleEnum.admin)
//     async update(
//         @Param("id") id: string,
//         @Body({ schema: updateSubCategorySchema }) body: updateSubCategoryDTO
//     ) {
//         return await this.subCategoryService.update(id, body);
//     }

//     @Delete(":id")
//     @Auth(RoleEnum.admin)
//     @HttpCode(HttpStatus.OK)
//     async remove(@Param("id") id: string) {
//         return await this.subCategoryService.remove(id);
//     }
// }
