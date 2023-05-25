import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private userRepository:Repository<UserEntity>
    ){}


    showAll(){
       return this.userRepository.find()
    }
   async  register(userDto:CreateUserDto){
        const isUserExist = await this.userRepository.findOne({where:{username:userDto.username}})
        if(isUserExist)
        throw new BadRequestException("Username is already exists")
        const user = await this.userRepository.create(userDto)
        await this.userRepository.save(user)
        return user
    }
    async login(loginUserDto:LoginUserDto){
       const {username,password} = loginUserDto;
       const user:UserEntity = await this.userRepository.findOne({where:{username}})
       
       
        if(!user)
        throw new BadRequestException("invalid username or password")

        const isCorrectPassword = await user.isCorrectPassword(password)

        if(!isCorrectPassword)
        throw new BadRequestException("invalid username or password")
        console.log("isCorrectPassword",isCorrectPassword);

        const token = await user.generateToken()
        return {message:"loged in successfully",user,token}
    }
}
