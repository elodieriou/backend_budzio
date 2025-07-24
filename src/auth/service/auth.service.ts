import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/service/prisma.service';
import { User } from '../../../generated/prisma';
import * as bcrypt from 'bcrypt';
import { AccessTokenType } from '../../models/access-token.type';

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
    login(user: User): AccessTokenType {
        const payload = { sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
