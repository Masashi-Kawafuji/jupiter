import nodemailer, { SentMessageInfo } from 'nodemailer';
import User from '../entities/user';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secure: true,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASSWORD,
  },
});

export default async function sendActivateToken(
  user: User
): Promise<SentMessageInfo> {
  await transporter.sendMail({
    from: 'kwfjmss@gmail.com',
    to: user.email,
    subject: 'アカウントを有効化してください。',
    text: `このURLにアクセスしてアカウントを有効化してください。\n${user.activateToken}`,
  });
}
