import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
    /**
     * Transporter mailer
     */
    private transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    /**
     * Send password reset email
     * @param email - User email
     * @param resetLink - Reset link
     */
    async sendPasswordResetEmail(email: string, resetLink: string) {
        await this.transporter.sendMail({
            from: `"Support Budzio" <${process.env.SUPPORT_BUDZIO}>`,
            to: email,
            subject: 'Réinitialisation de mot de passe',
            html: `
        <div style="font-family: Inter, sans-serif;">
            <p>Bonjour,</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
            <strong><a href="${resetLink}" style="color: #10b981">Cliquez ici pour le réinitialiser</a></strong>
            <p>Ce lien expirera dans 1 heure.</p>
            <p>Si vous n'êtes pas à l'origine de cette demande, veuillez ne pas en tenir compte.</p>
            <p style="color: #10b981">L'équipe Budzio, je gère mon budget au jour le jour.</p>
        </div>
      `,
        });
    }
}
