import { Router } from "express";
import OtpController from "../controllers/otp.controller";

const otpRoutes = Router();
const controller = new OtpController();

otpRoutes.post('/create', controller.createOtpCodeHandler);
otpRoutes.post('/verify', controller.verifyOtpCodeHandler);

export default otpRoutes;