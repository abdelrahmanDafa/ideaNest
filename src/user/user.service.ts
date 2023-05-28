import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    async whoAmI(id:number){
        const user = await this.userRepository.findOne({where:{id}})
        if(!user){
           throw new NotFoundException("idea not found")
        }
        return user;
      }
   async  register(userDto:CreateUserDto){
        const isUserExist = await this.userRepository.findOne({where:{username:userDto.username}})
        if(isUserExist)
        throw new BadRequestException("Username is already exists")
        const user = await this.userRepository.create(userDto)
        await this.userRepository.save(user)
        const token = await user.generateToken()
        return {message:"signed in successfully",user,token}

    }
    async login(loginUserDto:LoginUserDto){
       const {username,password} = loginUserDto;
       const user:UserEntity = await this.userRepository.findOne({where:{username}})
       
       
        if(!user)
        throw new BadRequestException("invalid username or password")

        const isCorrectPassword = await user.isCorrectPassword(password)

        if(!isCorrectPassword)
        throw new BadRequestException("invalid username or password")


        const token = await user.generateToken()
        return {message:"loged in successfully",user,token}
    }
    async deleteUser(id:number){
        const user = await this.userRepository.findOne({where:{id}});
        if(!user){
          throw new NotFoundException("user not found")
       }
       await this.userRepository.delete({id});
       return {message:"User deleted",user};  
      }
    async findUser(username:string)
    {
        const user:UserEntity = await this.userRepository.findOne({where:{username}}) 
        if(!user)
        throw new NotFoundException("User not found")
        return user;

    }
}
