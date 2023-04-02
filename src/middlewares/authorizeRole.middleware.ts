import { NextFunction, Response } from "express";
import { RoleEnum } from "../enums/role.enum";
import { UserService } from "../services/user.service";
import ErrorResponse from "../utils/errorResponse.util";

const UNAUTHORIZED_USER = "Unauthorized user !";
const userService: UserService = new UserService();

export default async function authorizeRoleMiddleware(authorizedRoles: RoleEnum[], req: any, res: Response, next: NextFunction) {
    try {

        const user = await userService.findById(req.user.id);

        if (!user) {
            throw new ErrorResponse('User not found, You are not authenticated', 404);
        }

        if (!authorizedRoles.includes(user.role)) {
            console.log('authorize role middleware reject the user', 401);
            throw new ErrorResponse(UNAUTHORIZED_USER, 401);
        }

        next();

    } catch (e) {
        next(new ErrorResponse(UNAUTHORIZED_USER, 401));
    }
}