import { Types } from "mongoose";
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "./user.model.js";

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
        getters: true,
        transform(doc, ret) {
            const brand = ret as any;
            delete brand.__v;
            delete brand.id;
            return brand;
        },
    },
    toObject: {
        virtuals: true,
        getters: true,
    },
    strict: true,
    strictQuery: true,
})
export class Brand {
    @Prop({
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    })
    name: string;

    @Prop({
        type: String,
        required: true,
        unique: true,
    })
    slug: string;

    @Prop({
        type: String,
    })
    image: string;

    @Prop({
        type: Types.ObjectId,
        ref: User.name,
        required: true,
    })
    createdBy: Types.ObjectId;
}

export const brandSchema = SchemaFactory.createForClass(Brand);

export const BrandModel = MongooseModule.forFeature([{ name: Brand.name, schema: brandSchema }]);