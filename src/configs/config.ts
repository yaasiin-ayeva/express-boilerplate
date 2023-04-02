import path = require("path");
require('dotenv').config();

const Env = {
    env: String(process.env.NODE_ENV),
    APP_PORT: Number(process.env.APP_PORT),
    JWT_KEY: String(process.env.APP_KEY),
    JWT_DEV_EXPIRE: String(process.env.JWT_DEV_EXPIRE),
    JWT_PROD_EXPIRE: String(process.env.JWT_PROD_EXPIRE),
    DB_HOST: String(process.env.DB_HOST),
    DB_PORT: Number(process.env.DB_PORT),
    DB_USER: String(process.env.DB_USER),
    DB_PASS: String(process.env.DB_PASS),
    DB_NAME: String(process.env.DB_NAME),
    TWILIO_ACCOUNT_SID: String(process.env.TWILIO_ACCOUNT_SID),
    TWILIO_AUTH_TOKEN: String(process.env.TWILIO_AUTH_TOKEN),
    VERIFICATION_SID: String(process.env.VERIFICATION_SID),
    SENDGRID_API_KEY: String(process.env.SENDGRID_API_KEY),
    SMTP_HOST: String(process.env.SMTP_HOST),
    SMTP_PORT: String(process.env.SMTP_PORT),
    SMTP_EMAIL: String(process.env.SMTP_EMAIL),
    SMTP_PASSWORD: String(process.env.SMTP_PASSWORD),
    FROM_NAME: String(process.env.FROM_NAME),
    FROM_EMAIL: String(process.env.FROM_EMAIL),
    GEOCODER_API_KEY: String(process.env.GEOCODER_API_KEY),
    GEOCODER_PROVIDER: String(process.env.GEOCODER_PROVIDER),
}

export default Env;