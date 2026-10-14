import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, isValidObjectId } from "mongoose";
// import slugify from "slugify";
import { slugify } from "../common/utils/slugify.js";
import { Brand } from "../common/models/brand.model.js";
import { HUser } from "../User/types/user.type.js";
import type { createBrandDTO, updateBrandDTO } from "./brand.validation.js";

@Injectable()
export class BrandService {
    constructor(
        @InjectModel(Brand.name) private readonly brandModel: Model<Brand>
    ) {}

    async create(body: createBrandDTO, user: HUser) {
        const isNameExist = await this.brandModel.findOne({ name: body.name });
        if (isNameExist) {
            throw new ConflictException("brand already exists");
        }

        const brand = await this.brandModel.create({
            ...body,
            slug: slugify(body.name),
            createdBy: user._id,
        });

        return {
            data: { brand },
        };
    }

    async findAll() {
        const brands = await this.brandModel.find().sort({ createdAt: -1 });
        return {
            data: { brands },
        };
    }

    async findOne(id: string) {
        const brand = await this.getBrandOrFail(id);
        return {
            data: { brand },
        };
    }

    async update(id: string, body: updateBrandDTO) {
        const brand = await this.getBrandOrFail(id);

        if (body.name && body.name != brand.name) {
            const isNameExist = await this.brandModel.findOne({ name: body.name });
            if (isNameExist) {
                throw new ConflictException("brand already exists");
            }
            brand.name = body.name;
            brand.slug = slugify(body.name);
        }

        if (body.image != undefined) {
            brand.image = body.image;
        }

        await brand.save();

        return {
            data: { brand },
        };
    }

    async remove(id: string) {
        const brand = await this.getBrandOrFail(id);
        await brand.deleteOne();
        return { data: {} };
    }

    private async getBrandOrFail(id: string) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException("invalid brand id");
        }

        const brand = await this.brandModel.findById(id);
        if (!brand) {
            throw new NotFoundException("brand not found");
        }

        return brand;
    }
}