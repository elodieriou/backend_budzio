import { Module } from '@nestjs/common';
import { UserController } from '../contollers/user.controller';
import { UserService } from '../services/user.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [PrismaModule],
})
export class UserModule {}
