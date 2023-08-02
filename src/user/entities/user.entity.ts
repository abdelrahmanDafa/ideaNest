import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BeforeInsert,
    OneToMany,
    ManyToMany,
    JoinTable,
  } from 'typeorm';
  import * as bcrypt from 'bcryptjs';
  import * as jwt from 'jsonwebtoken';
import { IdeaEntity } from '../../idea/entities/idea.entity';
import { Exclude, Expose } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
  

  
  @Entity('user')
  export class UserEntity {
    constructor(private jwtService:JwtService){}
    @PrimaryGeneratedColumn()
    id: number;
  
    @CreateDateColumn()
    created: Date;
  
    @Column({
      type: 'text',
      unique: true,
    })
    username: string;
  
    @Column('text')
    name: string;

    @Exclude()
    @Column('text') 
    password: string;

    @OneToMany(()=>IdeaEntity,(idea)=>idea.author)
    ideas:IdeaEntity[];

    @ManyToMany(()=>IdeaEntity,{cascade:true})
    @JoinTable({name:"bookmarks"})
    bookmarks:IdeaEntity[];

    @BeforeInsert()
    async hashPassword() {
       const hasgedPassword = await bcrypt.hash(this.password, 10);
       this.password = hasgedPassword
    }
   async isCorrectPassword(password:string){
    return await bcrypt.compare(password,this.password)
   }

   async generateToken(){
    const {id,username} = this;
    console.log("this.jwtService",this.jwtService);
    const token = this.jwtService.sign({id,username},{expiresIn:"1d"}) 
    return token;
   }
   //@Expose()
   toJSON(): any {
     return {
       ...this,
     };
   }
}