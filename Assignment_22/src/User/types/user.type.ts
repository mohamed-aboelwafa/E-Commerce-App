import { HydratedDocument, Types } from "mongoose"

export enum GenderEnum{
    male = 0,
    female = 1
}

export enum ProviderEnum{
    system,
    google
}

export enum RoleEnum{
    user,
    admin
}

export interface IUser{
    name: string
    email: string
    password: string
    age: number
    isOnline: boolean
    isActive: boolean
    gender: GenderEnum
    phone: string
    confirmedAt: Date 
    changedCredentialsAt: Date
    provider: ProviderEnum
    role: RoleEnum
    profilePic: string
    coverPics: string[]
    bio: string
    received?: [HUser]
    sent?: [HUser]
}


export interface JwtPayload{
    iat: number
    exp?: number
    email: string 
    _id: Types.ObjectId
}

export type HUser = HydratedDocument<IUser>


