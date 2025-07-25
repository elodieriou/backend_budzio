import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/service/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Create a user
     * @param data - User data
     */
    async createUser(data: {
        email: string;
        password: string;
        firstname: string;
        lastname: string;
    }): Promise<User> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const existingUsers = await this.prisma.user.count();
        const role: UserRole = existingUsers === 0 ? UserRole.SUPER_ADMIN : UserRole.USER;
        return this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstname: data.firstname,
                lastname: data.lastname,
                role,
            },
        });
    }

    /**
     * Find all users
     */
    findAllUsers(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    /**
     * Find a user by its id
     * @param id - User id
     */
    findOneUser(id: number): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { id } });
    }

    /**
     * Find a user by its email
     * @param email - User email
     */
    findOneUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    /**
     * Update a user
     * @param id - User id
     * @param data - User data to update
     */
    updateUser(id: number, data: UpdateUserDto): Promise<User> {
        return this.prisma.user.update({ where: { id }, data });
    }

    /**
     * Delete a user
     * @param id - User id
     */
    async deleteUser(id: number): Promise<User[]> {
        await this.prisma.user.delete({ where: { id } });
        return this.findAllUsers();
    }
}
