
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types, isValidObjectId } from "mongoose";
// import slugify from "slugify";
import { slugify } from "../common/utils/slugify.js";
import { SubCategory } from "../common/models/subCategory.model.js";
import { Category } from "../common/models/category.model.js";
import { HUser } from "../User/types/user.type.js";
import { createSubCategoryDTO, updateSubCategoryDTO } from "./subCategory.validation.js";

@Injectable()
export class SubCategoryService {
    constructor(
        @InjectModel(SubCategory.name) private readonly subCategoryModel: Model<SubCategory>,
        @InjectModel(Category.name) private readonly categoryModel: Model<Category>
    ) {}

    async create(body: createSubCategoryDTO, user: HUser) {
        await this.checkCategoryExist(body.category);
        await this.checkNameAvailable(body.name, body.category);

        const subCategory = await this.subCategoryModel.create({
            ...body,
            slug: slugify(body.name),
            createdBy: user._id,
        });

        return {
            data: { subCategory },
        };
    }

    async findAll(categoryId?: string) {
        const filter = categoryId ? { category: categoryId } : {};
        const subCategories = await this.subCategoryModel
            .find(filter)
            .populate("category", "name slug")
            .sort({ createdAt: -1 });

        return {
            data: { subCategories },
        };
    }

    async findOne(id: string) {
        const subCategory = await this.getSubCategoryOrFail(id);
        await subCategory.populate("category", "name slug");
        return {
            data: { subCategory },
        };
    }

    async update(id: string, body: updateSubCategoryDTO) {
        const subCategory = await this.getSubCategoryOrFail(id);
        const name = body.name ?? subCategory.name;
        const category = body.category ?? subCategory.category.toString();

        if (body.category && body.category != subCategory.category.toString()) {
            await this.checkCategoryExist(body.category);
        }
        if (name != subCategory.name || category != subCategory.category.toString()) {
            await this.checkNameAvailable(name, category, subCategory._id as Types.ObjectId);
        }

        subCategory.name = name;
        subCategory.slug = slugify(name);
        subCategory.category = new Types.ObjectId(category);
        if (body.image != undefined) {
            subCategory.image = body.image;
        }
        await subCategory.save();

        return {
            data: { subCategory },
        };
    }

    async remove(id: string) {
        const subCategory = await this.getSubCategoryOrFail(id);
        await subCategory.deleteOne();
        return { data: {} };
    }

    private async getSubCategoryOrFail(id: string) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException("invalid sub category id");
        }

        const subCategory = await this.subCategoryModel.findById(id);
        if (!subCategory) {
            throw new NotFoundException("sub category not found");
        }

        return subCategory;
    }

    private async checkCategoryExist(category: string) {
        const isCategoryExist = await this.categoryModel.exists({ _id: category });
        if (!isCategoryExist) {
            throw new NotFoundException("category not found");
        }
    }

    private async checkNameAvailable(name: string, category: string, excludedId?: Types.ObjectId) {
        const isNameExist = await this.subCategoryModel.findOne({
            name,
            category,
            ...(excludedId ? { _id: { $ne: excludedId } } : {}),
        });

        if (isNameExist) {
            throw new ConflictException("subcategory already exists in this category");
        }
    }
}



// import { Injectable, ConflictException, NotFoundException, BadRequestException } from "@nestjs/common";
// import { InjectModel } from "@nestjs/mongoose";
// import { Model, Types } from "mongoose";
// import slugify from "slugify";
// import { SubCategory } from "../common/models/subCategory.model.js";
// import { Category } from "../common/models/category.model.js";
// import { createSubCategoryDTO, updateSubCategoryDTO } from "./subCategory.validation.js";
// import { HUser } from "../User/types/user.type.js";

// @Injectable()
// export class SubCategoryService {
//     constructor(
//         @InjectModel(SubCategory.name) private readonly subCategoryModel: Model<SubCategory>,
//         @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
//     ) {}

//     async create(body: createSubCategoryDTO, user: HUser) {
//         if (!Types.ObjectId.isValid(body.category)) {
//             throw new BadRequestException("invalid category id");
//         }
//         const categoryExists = await this.categoryModel.findById(body.category);
//         if (!categoryExists) {
//             throw new NotFoundException("category not found");
//         }

//         const isNameExist = await this.subCategoryModel.findOne({ name: body.name, category: body.category });
//         if (isNameExist) {
//             throw new ConflictException("sub category already exist in this category");
//         }

//         const subCategory = await this.subCategoryModel.create({
//             ...body,
//             slug: slugify(body.name),
//             createdBy: user._id
//         });

//         return {
//             data: {
//                 subCategory
//             }
//         };
//     }

//     async findAll() {
//         const subCategories = await this.subCategoryModel.find().populate("category", "name slug").sort({ createdAt: -1 });
//         return {
//             data: {
//                 subCategories
//             }
//         };
//     }

//     async findOne(id: string) {
//         const subCategory = await this.getSubCategoryOrFail(id);
//         return {
//             data: {
//                 subCategory
//             }
//         };
//     }

//     async update(id: string, body: updateSubCategoryDTO) {
//         const subCategory = await this.getSubCategoryOrFail(id);

//         if (body.category) {
//             if (!Types.ObjectId.isValid(body.category)) {
//                 throw new BadRequestException("invalid category id");
//             }
//             const categoryExists = await this.categoryModel.findById(body.category);
//             if (!categoryExists) {
//                 throw new NotFoundException("category not found");
//             }
//             subCategory.category = new Types.ObjectId(body.category);
//         }

//         if (body.name && body.name != subCategory.name) {
//             const isNameExist = await this.subCategoryModel.findOne({ 
//                 name: body.name, 
//                 category: subCategory.category 
//             });
//             if (isNameExist) {
//                 throw new ConflictException("sub category already exist in this category");
//             }
//             subCategory.name = body.name;
//             subCategory.slug = slugify(body.name);
//         }

//         if (body.image != undefined) {
//             subCategory.image = body.image;
//         }

//         await subCategory.save();

//         return {
//             data: {
//                 subCategory
//             }
//         };
//     }

//     async remove(id: string) {
//         const subCategory = await this.getSubCategoryOrFail(id);
//         await subCategory.deleteOne();
//         return {
//             data: {}
//         };
//     }

//     private async getSubCategoryOrFail(id: string) {
//         if (!Types.ObjectId.isValid(id)) {
//             throw new BadRequestException("invalid sub category id");
//         }

//         const subCategory = await this.subCategoryModel.findById(id).populate("category", "name slug");
//         if (!subCategory) {
//             throw new NotFoundException("sub category not found");
//         }
//         return subCategory;
//     }
// }

