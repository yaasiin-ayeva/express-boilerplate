const nodemailer = require('nodemailer');
import Env from "../configs/config";

let host: string, port: any, user: any, pass: any;

const sendMail = async (options: any) => {

    if (!(Env.env === 'production')) {

        let testAccount = await nodemailer.createTestAccount();

        console.log('testAccount', testAccount);

        host = "smtp.ethereal.email";
        port = 587;
        user = testAccount.user; // generated ethereal user
        pass = testAccount.pass; // generated ethereal password

    } else {

        host = Env.SMTP_HOST;
        port = Env.SMTP_PORT;
        user = Env.SMTP_EMAIL;
        pass = Env.SMTP_PASSWORD;

    }

    const transporter = nodemailer.createTransport({
        host: host,
        port: port,
        auth: {
            user: user,
            pass: pass
        }
    });

    console.log('Options:', options);

    const message = {
        from: `${Env.FROM_NAME} <${Env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: `<b>${options.message}</b>`
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);

    if (!(Env.env === 'production')) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
};

export default sendMail;