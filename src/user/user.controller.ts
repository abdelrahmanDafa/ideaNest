import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from '../shared/auth.guard';

@Controller()
export class UserController {

    constructor(private userService:UserService){}

    @UseGuards(AuthGuard)
    @Get('api/users')
    showAllUsers(@CurrentUser() user:UserEntity) { 
      return this.userService.showAll();
    }


    @UseGuards(AuthGuard)
    @Get('api/users')
    whoAmI(@CurrentUser() user:UserEntity) {

      return this.userService.showAll();
    }

    @HttpCode(HttpStatus.OK)
    @Post('auth/login')
    login(@Body() data: LoginUserDto) {
      return this.userService.login(data);
    }
  
    @Post('auth/register')
    register(@Body() data: CreateUserDto) {
      return this.userService.register(data);
    }

    @UseGuards(AuthGuard)
    @Delete('api/users')
    deleteUser(@CurrentUser("id") id:number) {
      return this.userService.deleteUser(id);
    }
}
