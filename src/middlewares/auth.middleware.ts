import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken"
import Env from "../configs/config";
import { UserService } from "../services/user.service";
import ErrorResponse from "../utils/errorResponse.util";

const MISSING_AUTHORIZATION_TOKEN = "Missing authorization token";
const UNAUTHORIZED_USER = "Unauthorized user !";
const WRONG_AUTHORIZATION_TOKEN = "Wrong authorization token";

const userService: UserService = new UserService();

export default async function authMiddleware(req: any, res: Response, next: NextFunction) {
    try {

        let token: string;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // Set token from Bearer token in header
            token = req.headers.authorization.split(' ')[1];
            // Set token from cookie
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return next(new ErrorResponse(MISSING_AUTHORIZATION_TOKEN, 401));
        }

        jwt.verify(token, Env.JWT_KEY, async function (error: any, decodedToken: any) {
            if (error) {
                next(new ErrorResponse(UNAUTHORIZED_USER, 401));
            }

            const user = await userService.findById(decodedToken.id);
            if (user) {
                req.user = {
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
                    role: user.role,
                    wallet: user.wallet
                }
            } else {
                next(new ErrorResponse(WRONG_AUTHORIZATION_TOKEN, 401));
            }
            next();
        });
    } catch (e) {
        next(new ErrorResponse(WRONG_AUTHORIZATION_TOKEN, 401));
    }
}