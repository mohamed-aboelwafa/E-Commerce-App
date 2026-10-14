import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Category } from "../common/models/category.model.js";
import { isValidObjectId, Model } from "mongoose";
import { SubCategory } from "../common/models/subCategory.model.js";
import { createCategoryDTO, updateCategoryDTO } from "./category.validation.js";
import { HUser } from "../User/types/user.type.js";
// import slugify from "slugify";
import { slugify } from "../common/utils/slugify.js";



@Injectable()
export class CategoryService{
    constructor(
        @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
        @InjectModel(SubCategory.name) private readonly subCategoryModel: Model<SubCategory>,
    ){}

    async create(body: createCategoryDTO, user:HUser){
        const isNameExist = await this.categoryModel.findOne({name: body.name})

        if(isNameExist){
            throw new ConflictException("category already exist")
        }

        const category = await this.categoryModel.create({
            ...body,
            slug: slugify(body.name),
            createdBy: user._id
        })

        return {
            data:{
                category
            }
        }
    }

    async findAll(){
        const categories = await this.categoryModel.find().sort({createdAt: -1})
        return {
            data: {
                categories
            }
        }
    }

    async findOne(id: string){
        const category = await this.getCategoryOrFail(id)
        return {
            data: {
                category
            }
        }
    }

    async update(id: string, body: updateCategoryDTO){
        const category = await this.getCategoryOrFail(id)
        if(body.name && body.name != category.name){
            const isNameExist = await this.categoryModel.findOne({name: body.name})
            if(isNameExist){
                throw new ConflictException("category already exist")
            }
            category.name = body.name
            category.slug = slugify(body.name)
        }

        if(body.image != undefined){
            category.image = body.image
        }
        await category.save()

        return {
            data:{
                category
            }
        }
    }

    async remove(id: string){
        const category = await this.getCategoryOrFail(id)
        const hasSubCategories = await this.subCategoryModel.exists({category: category._id})
        if(hasSubCategories){
            throw new BadRequestException("delete the sub category of this category first")
        }
        await category.deleteOne()
        return {
            data:{}
        }
    }


    private async getCategoryOrFail(id: string){
        if(!isValidObjectId(id)){
            throw new BadRequestException("invalid category id")
        }

        const category = await this.categoryModel.findById(id)
        if(!category){
            throw new NotFoundException("category not found")
        }
        return category
    }
}
