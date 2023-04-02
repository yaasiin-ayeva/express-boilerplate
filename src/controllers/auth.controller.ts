import AuthService from "../services/auth.service";
import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/errorResponse.util";
import { UserService } from "../services/user.service";
import sendMail from "../utils/sendMail.sendgrid.util";
import { AuthUser } from "../interfaces/userAuth.interface";

export default class AuthController {

    private readonly authService: AuthService;
    private readonly userService: UserService;

    constructor() {
        this.authService = new AuthService();
        this.userService = new UserService();
    }

    // @desc      Register user
    // @route     POST /api/v1/auth/register
    // @access    Public
    public registerHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.authService.register(req.body);
            return res.status(201).json({
                success: true,
                message: "User Successfully Created",
                data: data
            });
        } catch (e) {
            next(e);
        }
    }

    // @desc      Login user
    // @route     POST /api/v1/auth/login
    // @access    Public
    public loginHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = await this.authService.login(req.body);
            console.log('token', token);
            return res.status(200).json({
                success: true,
                message: "User successfully logged in",
                token: token
            });
        } catch (e) {
            next(e);
        }
    }

    // @desc      Log user out / clear cookie
    // @route     GET /api/v1/auth/logout
    // @access    Private
    public logoutHandler = async (_, res: Response, next: NextFunction) => {
        try {

            res.cookie('token', 'none', {
                expires: new Date(Date.now() + 10 * 1000),
                httpOnly: true
            });

            res.status(200).json({
                success: true,
                data: {}
            });

        } catch (e) {
            next(new ErrorResponse(e.message, 500));
        }
    }

    // @desc      Get current logged in user
    // @route     POST /api/v1/auth/me
    // @access    Private
    public getMeHandler = async (req: any, res: Response, next: NextFunction) => {
        try {
            const user = await this.authService.getMe(req.user.id);
            return res.status(200).json({
                success: true,
                message: "user successfully fetched",
                data: user
            });
        } catch (e) {
            next(e);
        }
    }

    // @desc      Update user details
    // @route     PUT /api/v1/auth/update-details
    // @access    Private
    public updateDetailsHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.authService.updateDetails(req.body);
            return res.status(201).json({
                success: true,
                message: 'Updated details',
                data: data
            });
        } catch (e) {
            next(e);
        }
    }

    // @desc      Update password
    // @route     PUT /api/v1/auth/update-password
    // @access    Private
    public updatePasswordHandler = async (req: AuthUser, res: Response, next: NextFunction) => {
        try {
            const token = await this.authService.updatePassword(req.user, req.body);
            return res.status(201).json({
                success: true,
                message: "Password updated successfully",
                token: token
            });
        } catch (e) {
            next(e);
        }
    }

    // @desc      Forgot password
    // @route     POST /api/v1/auth/forgot-password
    // @access    Public
    public forgotPasswordHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { userId, resetToken } = await this.authService.forgotPassword(req.body);
            const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;
            const mailContent = `You are receiving this email because you (or someone else) has requested the reset of a password. Please open this link and reset your password : <br/> <link>${resetUrl}</link>`;

            try {
                const data = await sendMail({
                    to: req.body.email,
                    subject: `Password reset token`,
                    text: mailContent
                });

                return res.status(200).json({
                    success: true,
                    message: "Mail sent successfully",
                    data: data
                });
            } catch (err) {
                console.log(err);

                const data = {
                    resetPasswordToken: undefined,
                    resetPasswordExpire: undefined
                };

                await this.authService.updateUserResetTokenData(userId, data);
                throw new ErrorResponse('Email could not be sent', 500);
            }
        } catch (e) {
            next(e);
        }
    }

    // @desc      Reset password
    // @route     PUT /api/v1/auth/reset-password/:token
    // @access    Public
    public resetPasswordHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = await this.authService.resetPassword(req.params.token, req.body);
            return res.status(201).json({
                success: true,
                message: "Password reseted successfully",
                token: token
            });
        } catch (e) {
            next(e);
        }
    }
}

