import { UserEntity } from "src/user/entities/user.entity";
import { CreateDateColumn, Entity, PrimaryGeneratedColumn ,Column, ManyToOne, JoinColumn} from "typeorm";


@Entity("idea")

export class IdeaEntity{
   
    @PrimaryGeneratedColumn()
    id:number;

    @CreateDateColumn()
    created:Date;

    @Column('text')
    idea:string;

    @Column('text')
    description:string;

    @ManyToOne(
        ()=>UserEntity,
        (author)=>author.ideas,
        {eager:true})
    @JoinColumn({name:"author_id"})
    author:UserEntity;
}