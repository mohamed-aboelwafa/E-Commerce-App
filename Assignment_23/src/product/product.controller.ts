import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ProductService } from './product.service.js';
import { Auth } from '../common/decorators/auth.decorator.js';
import { type HUser, RoleEnum } from '../User/types/user.type.js';
import { type createProductDto, createProductSchema } from './product.validation.js';
import { User } from '../common/decorators/user.decorator.js';

@Controller('product')
export class ProductController {
    constructor (
        private readonly productService: ProductService
    ){}

    @Post()
    @Auth(RoleEnum.admin)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body({
        schema: createProductSchema
    }) body: createProductDto, @User() user: HUser) {
        const {data} = await this.productService.create(body, user)
        return {
            data
        }
    }
}
