import { Gender } from "../../enums/gender.enum";
import { RoleEnum } from "../../enums/role.enum";

export default interface RegisterDto {
    firstName: string
    lastName: string
    birthdate: Date
    birthplace: string
    nationality: string
    city: string
    district: string
    email: string
    phone: string
    password: string
    gender: Gender
    wallet: string
    role: RoleEnum
}