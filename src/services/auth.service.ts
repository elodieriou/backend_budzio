import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/service/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginType } from '../models/login.type';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
    ) {}

    /**
     * Check if it's a validate user
     * @param email - User email
     * @param password - User password
     */
    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        return user && (await bcrypt.compare(password, user.password)) ? user : null;
    }

    /**
     * Login user
     * @param user - User connected
     */
    login(user: User): LoginType {
        const payload = { sub: user.id, role: user.role };
        return {
            userId: user.id,
            access_token: this.jwtService.sign(payload),
        };
    }

    /**
     * Generate a password reset token
     * @param email - User email
     */
    async generatePasswordResetToken(email: string): Promise<string> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        const token = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        await this.prisma.user.update({
            where: { email },
            data: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000), // 1h
            },
        });

        return token;
    }

    /**
     * Reset user password using a valid token
     * @param token - Reset token
     * @param newPassword - New password
     */
    async resetPassword(token: string, newPassword: string): Promise<void> {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await this.prisma.user.findFirst({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { gt: new Date() },
            },
        });

        if (!user) {
            throw new NotFoundException('Le lien a expiré.');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });
    }
}
