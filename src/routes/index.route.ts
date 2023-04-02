import { Router } from "express";
import authRoutes from "./auth.route";
import otpRoutes from "./otp.route";

const apiRouter = Router();

apiRouter.use('/otp', otpRoutes);
apiRouter.use('/auth', authRoutes);

export default apiRouter;