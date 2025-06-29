import nodemailer from "nodemailer";
import ApiError from "@/utils/api.Error";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | undefined;

  constructor() {
    const host = process.env.EMAIL_HOST;
    const port = process.env.EMAIL_PORT
      ? parseInt(process.env.EMAIL_PORT, 10)
      : 587;
    const secure = process.env.EMAIL_SECURE === "true";
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!host || !user || !pass) {
      console.error(
        "Email configuration is missing in .env. The application will not be able to send emails."
      );
      // In a real application, you might want to throw an error to prevent the app from starting
      // throw new ApiError(500, "Email configuration is missing")
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  private async sendEmail(options: EmailOptions): Promise<void> {
    if (!this.transporter) {
      throw new ApiError(500, "Email transporter is not initialized");
    }

    const mailOptions = {
      from: `"FlashCard App" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      console.error("Error sending email", error);
      throw new ApiError(500, "Failed to send email");
    }
  }

  public async sendVerificationEmail(
    to: string,
    fullName: string,
    verificationCode: string
  ): Promise<void> {
    const subject = "Verify Your Email Address for FlashCard App";
    const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Hello ${fullName},</h2>
                <p>Thank you for registering. Please use the following code to verify your email address:</p>
                <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${verificationCode}</p>
                <p>This code will expire in 10 minutes.</p>
                <hr/>
                <p><em>If you did not request this, please ignore this email.</em></p>
            </div>
        `;

    await this.sendEmail({ to, subject, html });
  }
}

export default new EmailService();
