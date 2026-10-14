import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../common/models/product.model.js';
import { Model } from 'mongoose';
import { Category } from '../common/models/category.model.js';
import { SubCategory } from '../common/models/subCategory.model.js';
import { Brand } from '../common/models/brand.model.js';
import { createProductDto } from './product.validation.js';
import { HUser } from '../User/types/user.type.js';
// import slugify from 'slugify';
import { slugify } from "../common/utils/slugify.js";


@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<Product>,
        @InjectModel(Category.name) private readonly categoryModel: Model<Product>,
        @InjectModel(SubCategory.name) private readonly subcategoryModel: Model<Product>,
        @InjectModel(Brand.name) private readonly brandModel: Model<Product>,
    ){}

    async create(body: createProductDto, user: HUser) {
        const isCategoryExist = await this.categoryModel.exists({ _id: body.category })
        if (!isCategoryExist) {
            throw new NotFoundException("category not found")
        }

        const isSubcategoryExist = await this.subcategoryModel.exists({ _id: body.subcategory })
        if (!isSubcategoryExist) {
            throw new NotFoundException("sub category not found")
        }

        const isBrandExist = await this.brandModel.exists({ _id: body.brand })
        if (!isBrandExist) {
            throw new NotFoundException("brand not found")
        }

        const product = await this.productModel.create({
            ...body,
            slug: slugify(body.name),
            createdBy: user._id
        })

        return {
            data:{
                product
            }
        }
    }

}

