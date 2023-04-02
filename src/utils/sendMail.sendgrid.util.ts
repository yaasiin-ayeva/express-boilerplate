const sgMail = require('@sendgrid/mail');
import Env from "../configs/config";

const apiKey = Env.SENDGRID_API_KEY;

const sendMail = async (options: { to: any, from?: any, subject: any, text: any, html?: any }) => {

    sgMail.setApiKey(apiKey);

    const from = options.from || Env.FROM_EMAIL;
    const html = options.html || `<b>${options.text}</b>`;

    const message = {
        from: from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: html
    };

    const info = await sgMail.send(message);
};

export default sendMail;