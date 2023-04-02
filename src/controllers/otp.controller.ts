import { NextFunction, Request, Response } from "express";
import { OtpService } from "../services/otp.service";
import ErrorResponse from "../utils/errorResponse.util";

export default class OtpController {
    private readonly otpService: OtpService;

    constructor() {
        this.otpService = new OtpService();
    }

    // @desc      Generate OTP code
    // @route     POST /api/v1/otp/create
    // @access    Public
    public createOtpCodeHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.otpService.createOtpCode(req.body);
            if (data.status === 'pending') {
                return res.status(200).json({
                    success: true,
                    data: data
                });
            }
            throw new Error('Oups, Something went wrong !');
        } catch (e) {
            next(new ErrorResponse(e.message, 500));
        }
    }

    // @desc      Verify OTP code
    // @route     POST /api/v1/otp/verify
    // @access    Public
    public verifyOtpCodeHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.otpService.verifyOtpCode(req.body)
            if (data.status === 'approved') {
                return res.status(200).json({
                    success: true,
                    data: data
                });
            }
            throw new Error('wrong code');
        } catch (e) {
            next(new ErrorResponse(e.message, 400));
        }
    }
}