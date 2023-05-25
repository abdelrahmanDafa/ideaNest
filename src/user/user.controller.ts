import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller()
export class UserController {

    constructor(private userService:UserService){}

    @Get('api/users')
    showAllUsers() {
      return this.userService.showAll();
    }
    @Post('auth/login')
    login(@Body() data: LoginUserDto) {
      return this.userService.login(data);
    }
  
    @Post('auth/register')
    register(@Body() data: CreateUserDto) {
      return this.userService.register(data);
    }
}
