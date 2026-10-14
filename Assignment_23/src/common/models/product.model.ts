
import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Category } from "./category.model.js";
import { SubCategory } from "./subCategory.model.js";
import { Brand } from "./brand.model.js";
import { User } from "./user.model.js";
import slugify  from "slugify";


@Schema({
    timestamps: true,
    toJSON:{
        virtuals: true,
        getters: true,
        transform(doc, ret){
            const product = ret as any
            delete product.__v
            delete product.id
            return product
        }
    },
    strict: true,
    strictQuery: true
})
export class Product {

    @Prop({
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 200
    })
    name: string;

    @Prop({
        type: String,
        required: true,
    })
    slug: string;

    @Prop({
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    })
    description: string

    @Prop({
        type: [
            String
        ],
    })
    images: string[]

    @Prop({
        type: Number,
        required: true,
        minlength: 0
    })
    price: number

    @Prop({
        type: Number,
        default:0,
        minlength: 0,
        maxlength: 100
    })
    discount: number

    @Prop({
        type: Number,
        minlength: 0
    })
    finalPrice: number

    @Prop({
        type: Number,
        required: true,
        minlength: 0
    })
    stock: number

    @Prop({
        type: Number,
        default: 0,
        minlength: 0,
    })
    soldCount: number

    @Prop({
        type: Types.ObjectId,
        required: true,
        ref:Category.name
    })
    category: Types.ObjectId

    @Prop({
        type: Types.ObjectId,
        required: true,
        ref:SubCategory.name
    })
    subcategory: Types.ObjectId

    
    @Prop({
        type: Types.ObjectId,
        required: true,
        ref:Brand.name
    })
    brand: Types.ObjectId

    @Prop({
        type: Types.ObjectId,
        required: true,
        ref:User.name
    })
    createdBy: Types.ObjectId
}

export const productSchema = SchemaFactory.createForClass(Product)

productSchema.index({name: "text", description: "text"})


// productSchema.pre("save", function(){
//     if(this.isNew || this.isModified("name")){
//         this.slug = slugify(this.name)
//     }
// })

productSchema.pre("save", function(){
    if(this.isNew || this.isModified("price") || this.isModified("discount")){
        // this.finalPrice = this.price - (this.price * (this.discount ?? 0) / 100)
        this.finalPrice = Math.round(this.price - (this.price * (this.discount ?? 0) / 100))
    }
})

export const ProductModel = MongooseModule.forFeature([{name:Product.name, schema: productSchema}])

