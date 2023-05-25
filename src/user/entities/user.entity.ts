import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BeforeInsert,
  } from 'typeorm';
  import * as bcrypt from 'bcryptjs';
  import * as jwt from 'jsonwebtoken';
  

  
  @Entity('user')
  export class UserEntity {
    @PrimaryGeneratedColumn()
    id: string;
  
    @CreateDateColumn()
    created: Date;
  
    @Column({
      type: 'text',
      unique: true,
    })
    username: string;
  
    @Column('text')
    name: string;

    @Column('text') 
    password: string;

    @BeforeInsert()
    async hashPassword() {
        const hasgedPassword = await bcrypt.hash(this.password, 10);
        console.log("user entity",this.password,hasgedPassword);
        
       this.password = hasgedPassword
    }
   async isCorrectPassword(password:string){
    return await bcrypt.compare(password,this.password)
   }

   async generateToken(){
    const {id,username} = this;
    const token = await jwt.sign(
      {id,username} ,
      process.env.SECRET,
      {expiresIn:"1d"}
    )
    return token;
   }
 
}