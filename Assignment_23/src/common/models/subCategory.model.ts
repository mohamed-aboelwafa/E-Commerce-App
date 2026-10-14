
import {Types} from "mongoose";
import {User} from "./user.model.js";
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Category } from "./category.model.js";

@Schema({
    timestamps: true,
    toJSON:{
        virtuals: true,
        getters: true,
        transform(doc, ret){
            const category = ret as any
            delete category.__v
            delete category.id
            return category
        }
    },
    toObject:{
        virtuals: true,
        getters: true,
    },
    strict: true,
    strictQuery: true
})


export class SubCategory {
    @Prop({
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    })
    name: string;

    @Prop({
        type: String,
        required: true,
        unique: true
    })
    slug: string;

    @Prop({
        type: String,
    })
    image: string;

    @Prop({
        type: Types.ObjectId,
        ref: Category.name,
        required: true
    })
    category: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: User.name,
        required: true
    })
    createdBy: Types.ObjectId;
}

export const subCategorySchema = SchemaFactory.createForClass(SubCategory)

subCategorySchema.index({name: 1, category: 1} , {unique: true})
subCategorySchema.index({slug: 1, category: 1} , {unique: true})

export const SubCategoryModel = MongooseModule.forFeature([{name: SubCategory.name, schema:subCategorySchema}])


