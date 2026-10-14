import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { RoleEnum } from "../User/types/user.type.js";
import type { HUser } from "../User/types/user.type.js";
import { Auth } from "../common/decorators/auth.decorator.js";
import { User } from "../common/decorators/user.decorator.js";
import { BrandService } from "./brand.service.js";
import { createBrandSchema, updateBrandSchema } from "./brand.validation.js";
import type { createBrandDTO, updateBrandDTO } from "./brand.validation.js";

@Controller("brands")
export class BrandController {
    constructor(private readonly brandService: BrandService) {}

    @Post()
    @Auth(RoleEnum.admin)
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body({ schema: createBrandSchema }) body: createBrandDTO,
        @User() user: HUser
    ) {
        const { data } = await this.brandService.create(body, user);
        return { data };
    }

    @Get()
    async findAll() {
        const { data } = await this.brandService.findAll();
        return { data };
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        const { data } = await this.brandService.findOne(id);
        return { data };
    }

    @Put(":id")
    @Auth(RoleEnum.admin)
    async update(
        @Param("id") id: string,
        @Body({ schema: updateBrandSchema }) body: updateBrandDTO
    ) {
        const { data } = await this.brandService.update(id, body);
        return { data };
    }

    @Delete(":id")
    @Auth(RoleEnum.admin)
    async remove(@Param("id") id: string) {
        const { data } = await this.brandService.remove(id);
        return { data };
    }
}