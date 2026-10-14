import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Brand } from "../common/models/brand.model.js";
import { brandSchema } from "../common/models/brand.model.js";
import { BrandController } from "./brand.controller.js";
import { BrandService } from "./brand.service.js";
import { User } from "../common/models/user.model.js";
import { userSchema } from "../common/models/user.model.js";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Brand.name, schema: brandSchema },
            { name: User.name, schema: userSchema },
        ]),
        JwtModule,
    ],
    controllers: [BrandController],
    providers: [BrandService],
    exports: [BrandService],
})
export class BrandModule {}