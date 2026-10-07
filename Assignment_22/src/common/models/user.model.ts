import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { GenderEnum, IUser, ProviderEnum, RoleEnum } from "../../User/types/user.type.js";
import { HashService } from "../security/hash.service.js";
import { EncryptionService } from "../security/encryption.service.js";


@Schema({
    timestamps: true,
    toJSON:{
        virtuals: true,
        getters: true,
        transform(doc, ret){
            const user = ret as any
            delete user.password
            delete user._v
            delete user.id
            return user
        }
    },
    toObject:{
        virtuals: true,
        getters: true,
    },
    strict: true,
    strictQuery: true
})
export class User implements IUser{
    @Prop({
        type: String,
        required: true
    })
    name: string;

    @Prop({
        type: String,
        required: true
    })
    password: string;

    @Prop({
        type: String,
        required: true,
        unique: true
    })
    email: string;

    @Prop({
        type: Number
    })
    age: number;

    @Prop({
        type: String
    })
    bio: string;

    @Prop({
        type: String,
        enum: Object.values(GenderEnum)
    })
    gender: GenderEnum;

    @Prop({
        type: String
    })
    phone: string;

    @Prop({
        type: String
    })
    profilePic: string;

    @Prop({
        type: String
    })
    coverPic: string;

    @Prop({
        type: [String]
    })
    coverPics: [string];

    @Prop({
        type: Date
    })
    confirmedAt: Date;

    @Prop({
        type: Boolean,
        default: false
    })
    isActive: boolean;

    @Prop({
        type: Boolean,
        default: false
    })
    isOnline: boolean;

    @Prop({
        type: String,
        enum: Object.values(ProviderEnum),
        default: ProviderEnum.system
    })
    provider: ProviderEnum;

    @Prop({
        type: String,
        enum: Object.values(RoleEnum),
        default: RoleEnum.user
    })
    role: RoleEnum;

    @Prop({
        type: Date
    })
    changedCredentialsAt: Date;
}


export const userSchema = SchemaFactory.createForClass(User)

export const buildSchema = (
    hashService: HashService,
    encryptionService: EncryptionService
) =>{
    userSchema.path("phone").get((value: string)=> value? encryptionService.decrypt(value) : value)
    userSchema.path("phone").set((value: string)=> value? encryptionService.encrypt(value) : value)
    userSchema.pre("save",async function(){
        if(this.isNew || this.isModified("password")){
            this.password = await hashService.hash(this.password)
        }
    })
    userSchema.pre(["updateOne","updateMany", "findOneAndUpdate"], async function(){
        const update = this.getUpdate() as Record<string, any>
        if(!update){
            return
        }
        const target = update.$set ?? update
        if(target.password){
            target.password = await hashService.hash(target.password)
        }
    })
}

export const UserModel = MongooseModule.forFeature([{name: User.name, schema: userSchema}])
