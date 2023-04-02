import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export default abstract class BaseModel extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    public id: string

    @CreateDateColumn()
    public createdAt?: Date

    @UpdateDateColumn()
    public updatedAt?: Date

}