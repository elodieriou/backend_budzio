import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() data: { email: string; password: string; firstname: string; lastname: string }) {
        return this.userService.createUser(data);
    }

    @Get()
    findAll() {
        return this.userService.findAllUsers();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.userService.findOneUser(+id);
    }

    @Get('email/:email')
    findByEmail(@Param('email') email: string) {
        return this.userService.findOneUserByEmail(email);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() data: UpdateUserDto) {
        return this.userService.updateUser(+id, data);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.userService.deleteUser(+id);
    }
}
