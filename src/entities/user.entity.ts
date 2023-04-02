import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { Gender } from "../enums/gender.enum";
import { RoleEnum } from "../enums/role.enum";
import BaseModel from "./base.entity";

@Entity("user")
export class User extends BaseModel {

    @Column({ type: "varchar" })
    firstName: string

    @Column({ type: "varchar" })
    lastName: string

    @Column({
        type: "enum",
        enum: Gender,
        default: Gender.NOT_SPECIFIED
    })
    gender: Gender

    @Column({ type: "date" })
    birthdate: Date

    @Column({ type: "varchar" })
    birthplace: string

    @Column({ type: "varchar" })
    nationality: string

    @Column({ type: "varchar" })
    city: string

    @Column({ type: "varchar" })
    district: string

    @Column({ type: "varchar", unique: true })
    email: string

    @Column({ type: "varchar", unique: true })
    phone: string

    @Column({ type: "varchar" })
    password: string

    @Column({ type: "varchar", default: "" })
    photo: string

    @Column({ type: "enum", enum: RoleEnum })
    role: RoleEnum

    @Column({ type: "varchar", nullable: true })
    resetPasswordToken: string

    @Column({ type: "date", nullable: true })
    resetPasswordExpire: Date

    @Column({ type: "boolean", default: true })
    enabled: boolean

    @Column({ type: "varchar", nullable: true })
    wallet: string
}