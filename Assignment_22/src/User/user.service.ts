import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../common/models/user.model.js";
import { Model } from "mongoose";
import { CreateUserDto } from "./DTO/createUser.dto.js";
import { HashService } from "../common/security/hash.service.js";
import { EncryptionService } from "../common/security/encryption.service.js";
import { createOtp } from "../common/email/createOtp.js";
import { signupKey } from "../common/redis/redis.services.js";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { confirmEmailDTO, loginDTO, signupDTO } from "./user.validation.js";
import { sendEmail } from "../common/email/sendEmail.js";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService{
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly hashService: HashService,
        private readonly encryptionService: EncryptionService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ){}

    async create_user(body: CreateUserDto){
        return this.userModel.create(body)
    }

    async get_all_users(){
        const users = await this.userModel.find();

        await this.cacheManager.set(signupKey("M"), 123456, 30000);
        console.log({otp: await this.cacheManager.get(signupKey("M"))});

        return {data: users};
    }

    async hash_and_compare_test(){
        const name = "mohamed";
        const hashed_name = await this.hashService.hash(name);
        const verfied_name = await this.hashService.compare(name, hashed_name);

        return await {hashed_name, verfied_name}
    }

    async encryption_and_decryption_test(){
        const name = "mohamed";
        const encrypted_name = await this.encryptionService.encrypt(name);
        const decrypted_name = await this.encryptionService.decrypt(encrypted_name);

        return await {
            name,
            encrypted_name,
            decrypted_name
        }
    }

    async signup(body: signupDTO){
        const isEmailExist = await this.userModel.findOne({
            email: body.email
        })

        if(isEmailExist){
            throw new BadRequestException("email already exist")
        }

        const user = await this.userModel.create(body)
        
        // generate otp
        const otp = createOtp()
        await this.cacheManager.set(signupKey(user.id), otp, 5*60*1000)

        // sending otp to email
        sendEmail({to:user.email, subject:"confirm your email", html:`<h1>${otp}</h1>`})
        
        return {
            data:{
                user
            }
        }
    }

    async confirmEmail(body:confirmEmailDTO){
        // check if user exists
        const user = await this.userModel.findOne({
            email: body.email,
            confirmedAt:{
                $exists: false
            }
        })
        if(!user){
            throw new NotFoundException("user not found")
        }

        // extracting otp of this user
        const otp = await this.cacheManager.get(signupKey(user.id))

        if(!otp || otp!=body.otp){
            throw new BadRequestException("invalid or expired otp")
        }

        user.confirmedAt = new Date(Date.now())

        this.cacheManager.del(signupKey(user.id))

        await user.save()

        return {
            data :{}
        }
    }

    async login(body:loginDTO){

        // check if email exists
        const user = await this.userModel.findOne({email: body.email, confirmedAt:{$exists: true}});
        if(!user){
            throw new BadRequestException("ivalid cridentilas");
        }

        // compare body.password with user.password
        if(!await this.hashService.compare(body.password, user.password)){
            throw new BadRequestException("ivalid password");
        }

        // generate accessToken
        const accessToken = await this.jwtService.signAsync({
            email: user.email,
            _id: user._id
        },{
            secret: this.configService.get<string>("TOKEN_SECRET"),
            expiresIn: "30m"
        })

        return {
            data:{
                accessToken
            }
        }
    }
}