import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import Env from "../configs/config";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import ForgotPasswordDto from "../dtos/auth/forgotPassword.dto";
import LoginDto from "../dtos/auth/login.dto";
import RegisterDto from "../dtos/auth/register.dto";
import ResetPasswordDto from "../dtos/auth/resetPassword.dto";
import UpdateDetailsDto from "../dtos/auth/updateDetails.dto";
import UpdatePasswordDto from "../dtos/auth/updatePassword.dto";
import { User } from "../entities/user.entity";
import validator from 'validator';
import ErrorResponse from "../utils/errorResponse.util";
import { UserService } from "./user.service";
import UserAuth from "../interfaces/userAuth.interface";
import ResetTokensData from "../interfaces/resetTokensData.interface";

const crypto = require('crypto');

export default class AuthService {

    private readonly userRepo: Repository<User>;
    private readonly userService: UserService;

    constructor() {
        this.userRepo = AppDataSource.getRepository(User);
        this.userService = new UserService();
    }

    public async register(data: RegisterDto) {

        if (
            validator.isEmpty(data.firstName) ||
            validator.isEmpty(data.lastName) ||
            validator.isEmpty(data.role)
        ) {
            console.log('missing parameters');
            throw new ErrorResponse('Bad requests, some parameters are empty', 400);
        }

        if (!validator.isEmail(data.email)) {
            console.log('invalid email');
            throw new ErrorResponse('Bad requests, invalid email', 400);
        }

        if (data.password.length < 8) {
            console.log('password is invalid');
            throw new ErrorResponse('Invalid password, must be at least length 8', 400);
        }

        let user = await this.userService.findByEmail(data.email);
        if (user) {
            throw new ErrorResponse('User With the same email already exists', 409);
        }

        user = await this.userService.findByPhone(data.phone);
        if (user) {
            throw new ErrorResponse('User With the same phone number already exists', 409);
        }

        data.password = AuthService.cryptPassword(data.password);

        return this.userRepo.save(data);
    }

    public async login(data: LoginDto) {

        const { email, password } = data;

        if (!email || !password) {
            throw new ErrorResponse('Please provide an email and password', 400);
        }

        if (!validator.isEmail(data.email)) {
            console.log('invalid email');
            throw new ErrorResponse('Bad requests, invalid email', 400);
        }

        const user = await this.userRepo.createQueryBuilder("user")
            .where("user.email = :email", { email: data.email })
            .getOne();

        if (!user) {
            console.log(`Unknown  user with email : ${data.email}`);
            throw new ErrorResponse('User not found', 404);
        } else {

            if (AuthService.isTheSamePassword(data.password, user.password)) {
                return await AuthService.signToken(user);
            } else {
                console.log("Mot de passe incorrect. Veuillez réessayer!");
                throw new ErrorResponse("Password does not match with record!", 401);
            }
        }
    }

    public async updateDetails(data: UpdateDetailsDto) {
        return null;
    }

    public async updatePassword(userAuth: UserAuth, data: UpdatePasswordDto) {

        let user = await this.userService.findById(userAuth.id);

        if (!(AuthService.isTheSamePassword(data.old_pass, user.password))) {
            throw new ErrorResponse("Password is incorrect", 401);
        }

        if (data.new_pass.length < 8) {
            console.log('password is invalid');
            throw new ErrorResponse("Invalid password, must be at least length 8", 400);
        }

        user.password = AuthService.cryptPassword(data.new_pass);
        await this.userRepo.update(user.id, { password: user.password });

        user = await this.userRepo.createQueryBuilder("user")
            .where("user.email = :email", { email: userAuth.email })
            .getOne();

        return await AuthService.signToken(user);
    }

    public async forgotPassword(data: ForgotPasswordDto) {

        const user = await this.userService.findByEmail(data.email);
        if (!user) {
            throw new ErrorResponse('There is no user with that email', 404);
        }

        // Generate token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to resetPasswordToken field
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire 15 min
        const resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        const resetTokensData: ResetTokensData = {
            resetToken: resetToken,
            data: {
                resetPasswordToken: resetPasswordToken,
                resetPasswordExpire: resetPasswordExpire
            }
        }

        await this.updateUserResetTokenData(user.id, resetTokensData.data);
        return { userId: user.id, resetToken };
    }

    public async resetPassword(token: string, data: ResetPasswordDto) {

        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await this.userRepo.createQueryBuilder("user")
            .where("user.resetPasswordToken = :token", { token: resetPasswordToken })
            .andWhere("user.resetPasswordExpire >= :expire", { expire: Date.now() })
            .getOne();

        if (!user) {
            throw new ErrorResponse('Invalid token', 400);
        }

        // Set new password
        user.password = AuthService.cryptPassword(data.password);
        await this.userRepo.update(user.id, { password: user.password });

        const userTokenInfosReset = {
            resetPasswordToken: null,
            resetPasswordExpire: null
        };

        await this.updateUserResetTokenData(user.id, userTokenInfosReset);

        return await AuthService.signToken(user);
    }

    public async getMe(id: string) {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new ErrorResponse("Invalid token", 404);
        }
        return user;
    }

    public async updateUserResetTokenData(userId: string, data: any) {

        const token = data.resetPasswordToken ? data.resetPasswordToken : null;
        const expire = data.resetPasswordExpire ? new Date(data.resetPasswordExpire) : null;

        await this.userRepo.update(userId, {
            resetPasswordToken: token,
            resetPasswordExpire: expire
        });
    }

    private static isTheSamePassword(
        password: string,
        hashedPassword: string
    ): boolean {
        return bcrypt.compareSync(password, hashedPassword);
    }

    private static cryptPassword(password: string): string {
        const salt = bcrypt.genSaltSync(12);
        return bcrypt.hashSync(password, salt);
    }

    private static async signToken(user: any) {
        const token_data: UserAuth = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
            birthdate: user.birthdate,
            birthplace: user.birthplace,
            nationality: user.nationality,
            city: user.city,
            district: user.district,
            email: user.email,
            phone: user.phone,
            password: user.password,
            role: user.role,
            wallet: user.wallet
        }

        return jwt.sign(token_data, Env.JWT_KEY, {
            algorithm: "HS512",
            expiresIn: Env.env === 'production' ? Env.JWT_PROD_EXPIRE : Env.JWT_DEV_EXPIRE
        });
    }
}
