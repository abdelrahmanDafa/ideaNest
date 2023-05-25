import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from 'src/shared/auth.guard';

@Controller()
export class UserController {

    constructor(private userService:UserService){}

    @UseGuards(AuthGuard)
    @Get('api/users')
    showAllUsers(@CurrentUser() user:UserEntity) {
      console.log("cc",user);
      
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
