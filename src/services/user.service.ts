import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import SetPhotoDto from "../dtos/user/setPhoto.dto";
import { User } from "../entities/user.entity";
import { RoleEnum } from "../enums/role.enum";
import ErrorResponse from "../utils/errorResponse.util";

export class UserService {

    private readonly repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    public async findById(id: any) {
        return await this.repository.createQueryBuilder("user")
            .where("user.id = :id", { id: id })
            .getOne();
    }

    public async findByEmail(email: string) {
        return await this.repository.createQueryBuilder("user")
            .where("user.email = :email", { email: email })
            .getOne();
    }

    public async findByPhone(phone: string) {
        return await this.repository.createQueryBuilder("user")
            .where("user.phone = :phone", { phone: phone })
            .getOne();
    }

    public async findAllByRole(role: RoleEnum) {
        return await this.repository.createQueryBuilder("user")
            .where("user.role = :role", { role: role })
            .getManyAndCount();
    }

    public async setPhoto(id: any, data: SetPhotoDto) {
        const user = this.findById(id);
        if (!user) {
            throw new ErrorResponse(`User ${id} does not exist`, 404);
        }
        return await this.repository.update(id, data);
    }

    public async delete(id: any) {
        const user = await this.findById(id);
        if (user) {
            return await this.repository.delete(id);
        } else {
            throw new ErrorResponse("User not found", 404);
        }
    }
}