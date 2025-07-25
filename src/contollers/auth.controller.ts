import { Body, Controller, Patch, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { MailerService } from '../services/mailer.service';
import { AccessTokenType } from '../models/access-token.type';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly mailerService: MailerService,
    ) {}

    @Post('login')
    async login(@Body() body: { email: string; password: string }): Promise<AccessTokenType> {
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
            const resetLink = `http://localhost:4200/auth/reset-password?token=${token}`;
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
