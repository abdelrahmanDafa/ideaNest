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
import { IdeaEntity } from 'src/idea/entities/idea.entity';
import { Exclude } from 'class-transformer';
  

  
  @Entity('user')
  export class UserEntity {
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