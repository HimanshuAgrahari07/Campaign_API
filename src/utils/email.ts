const nodemailer = require('nodemailer');
import { IEmail } from '../interfaces';
/**@ts-ignore */
import * as config from "../configuration";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email.EMAIL_USERNAME,
        pass: config.email.EMAIL_PASSWORD
    }
});

const basicEmailConfig = {
    // It should be a string of sender email
    from: `Himanshu <osmhimanshu.a@gmail.com>`,
    // Subject of Email
    subject: 'Campaign update',
}

const getConfiguration = (email: IEmail): IEmail => {
    return {
        ...basicEmailConfig,
        to: email.to,
        subject: email.subject || basicEmailConfig.subject,
        text: email.text || '',
        attachments: email.attachments || []
    }
}

const sendEmail = (mailConfigurations: IEmail) => {
    transporter.sendMail(mailConfigurations, function (error: any, info: any) {
        if (error) throw error;
        console.log('Email Sent Successfully');
        console.log(info);
    });
}

export const sendResetPasswordEmail = (email: string, token: string) => {
    const mailConfigurations = getConfiguration({
        to: email,
        subject: 'Reset Password',
        text: `
        <p>
            <a href="${config.baseUrl}/reset_password/${token}">Click here to reset your password</a>
        </p>
        `
    })
    sendEmail(mailConfigurations)
}