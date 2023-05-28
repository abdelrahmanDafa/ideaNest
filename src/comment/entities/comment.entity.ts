import { IdeaEntity } from "../../idea/entities/idea.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class CommentEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @CreateDateColumn()
    created:Date;

    @Column("text")
    content:string;

    @ManyToOne(()=>UserEntity)
    author:UserEntity;

    @ManyToOne(()=>IdeaEntity,idea=>idea.comments)
    idea:IdeaEntity;
}