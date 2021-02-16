import nodemailer, { SendMailOptions, SentMessageInfo } from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import fs from 'fs';

interface MailDeliveryOptions<T>
  extends Pick<SendMailOptions, 'to' | 'subject'> {
  template: string;
  data: T | Record<string, any>;
}

class Mailer {
  private static transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: true,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  static async deliverMail<T>(
    options: MailDeliveryOptions<T>
  ): Promise<SentMessageInfo> {
    const templateFile = path.resolve(
      __dirname,
      '../templates/mail',
      `${options.template}.ejs`
    );
    const template = await fs.readFileSync(templateFile, {
      encoding: 'utf8',
    });
    const html = ejs.render(template, options.data);

    return this.transporter.sendMail({
      from: process.env.MAILER_USER,
      to: options.to,
      subject: options.subject,
      html,
    });
  }
}

export default Mailer;
