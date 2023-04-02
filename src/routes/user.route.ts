import { Router } from "express";
import UserController from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";

const userRoutes = Router();
const controller = new UserController();


userRoutes.put('/photo', authMiddleware, controller.setPhotoHandler);

export default userRoutes;