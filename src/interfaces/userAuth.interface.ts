import { Request } from "express";

export default interface UserAuth {
    id: string,
    firstName: string,
    lastName: string,
    gender: string,
    birthdate: Date,
    birthplace: string,
    nationality: string,
    city: string,
    district: string,
    email: string,
    phone: string,
    password: string,
    role: string,
    wallet: string
}

export interface AuthUser extends Request {
    user: UserAuth
}