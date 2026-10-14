import { Module } from '@nestjs/common';
import { ProductController } from './product.controller.js';
import { ProductService } from './product.service.js';
import { JwtModule } from '@nestjs/jwt';
import { UserModel } from '../common/models/user.model.js';
import { ProductModel } from '../common/models/product.model.js';
import { CategoryModel } from '../common/models/category.model.js';
import { SubCategoryModel } from '../common/models/subCategory.model.js';
import { BrandModel } from '../common/models/brand.model.js';

@Module({
  imports:[JwtModule, UserModel, ProductModel, CategoryModel, SubCategoryModel, BrandModel],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
