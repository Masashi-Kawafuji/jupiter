import nodemailer from 'nodemailer';

const mailer = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.MAILER_USER,
    clientId: process.env.MAILER_CLIENT_ID,
    clientSecret: process.env.MAILER_CLIENT_SECRET,
    // serviceClient: process.env.MAILER_CLIENT_ID,
    // privateKey: process.env.MAILER_PRIVATE_KEY,
    // accessToken: process.env.MAILER_ACCESS_TOKEN,
    // refreshToken: process.env.MAILER_REFRESH_TOKEN,
  },
});

export default mailer;
