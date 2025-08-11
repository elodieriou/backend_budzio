import { Body, Controller, Patch, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { MailerService } from '../services/mailer.service';
import { LoginType } from '../models/login.type';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

@Controller('auth')
export class AuthController {
    /**
     * Api url
     */
    private _apiUrl = process.env.API_URL;

    constructor(
        private readonly authService: AuthService,
        private readonly mailerService: MailerService,
    ) {}

    @Post('login')
    async login(@Body() body: { email: string; password: string }): Promise<LoginType> {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Email ou mot de passe incorrect');
        }
        return this.authService.login(user);
    }

    @Post('request-password-reset')
    async requestPasswordReset(@Body() body: { email: string }) {
        try {
            const token = await this.authService.generatePasswordResetToken(body.email);
            const resetLink = `${this._apiUrl}/auth/reset-password?token=${token}`;
            await this.mailerService.sendPasswordResetEmail(body.email, resetLink);
        } catch {
            /* empty */
        }

        return {
            message: "Un email de réinitialisation a été envoyé si l'adresse existe.",
        };
    }

    @Patch('reset-password')
    async resetPassword(@Body() body: ResetPasswordDto) {
        await this.authService.resetPassword(body.token, body.newPassword);
        return { message: 'Mot de passe réinitialisé avec succès.' };
    }
}
