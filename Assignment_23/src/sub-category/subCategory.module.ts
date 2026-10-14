
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SubCategory } from "../common/models/subCategory.model.js";
import { subCategorySchema } from "../common/models/subCategory.model.js";
import { SubCategoryController } from "./subCategory.controller.js";
import { SubCategoryService } from "./subCategory.service.js";
import { Category } from "../common/models/category.model.js";
import { categorySchema } from "../common/models/category.model.js";
import { User, userSchema } from "../common/models/user.model.js";
import { JwtModule } from "@nestjs/jwt";


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SubCategory.name, schema: subCategorySchema },
            { name: Category.name, schema: categorySchema },
            { name: User.name, schema: userSchema },
        ]),
        JwtModule,
    ],
    controllers: [SubCategoryController],
    providers: [SubCategoryService],
    exports: [SubCategoryService],
})
export class SubCategoryModule {}


// @Module({
//     imports: [
//         MongooseModule.forFeature([
//             { name: SubCategory.name, schema: subCategorySchema },
//             { name: Category.name, schema: categorySchema },
//             { name: User.name },
//         ]),
//         JwtModule,
//     ],
//     controllers: [SubCategoryController],
//     providers: [SubCategoryService],
//     exports: [SubCategoryService],
// })
// export class SubCategoryModule {}