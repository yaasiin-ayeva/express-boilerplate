import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { RoleEnum } from "../enums/role.enum";
import authMiddleware from "../middlewares/auth.middleware";
import restrictRoleMiddleware from "../middlewares/restrictRole.middleware";

const controller = new AuthController();
const authRoutes = Router();

authRoutes.post('/register', controller.registerHandler);
authRoutes.post('/login', controller.loginHandler);
authRoutes.get('/logout', controller.logoutHandler);

authRoutes.post('/me', authMiddleware, controller.getMeHandler);
authRoutes.put('/update-details', authMiddleware, restrictRoleMiddleware.bind(null, [RoleEnum.ADMIN]), controller.updateDetailsHandler);
authRoutes.put('/update-password', authMiddleware, controller.updatePasswordHandler);

authRoutes.post('/forgot-password', controller.forgotPasswordHandler);
authRoutes.put('/reset-password/:token', controller.resetPasswordHandler);

export default authRoutes;