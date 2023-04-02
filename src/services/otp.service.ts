import CreateOtpCode from "../dtos/otp/create.dto";
import VerifyOtpCode from "../dtos/otp/verify.dto";

import Env from "../configs/config";

const TWILIO_ACCOUNT_SID = Env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = Env.TWILIO_AUTH_TOKEN;
const VERIFICATION_SID = Env.VERIFICATION_SID;

const twilio = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export class OtpService {

    public async createOtpCode(data: CreateOtpCode) {
        const channel = data.verificationMethod;
        return await twilio.verify.services(VERIFICATION_SID)
            .verifications
            .create({ to: data.phoneNumber, channel: channel, locale: "fr" });
    }

    public async verifyOtpCode(data: VerifyOtpCode) {
        return await twilio.verify.services(VERIFICATION_SID)
            .verificationChecks
            .create({ to: data.phoneNumber, code: data.code });
    }
}