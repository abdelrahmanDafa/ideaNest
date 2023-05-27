import { CommentEntity } from "src/comment/entities/comment.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { CreateDateColumn, Entity, PrimaryGeneratedColumn ,Column, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany} from "typeorm";


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
    @ManyToMany(type => UserEntity, { cascade: true })
    @JoinTable()
    upvotes: UserEntity[];
  
    @ManyToMany(type => UserEntity, { cascade: true })
    @JoinTable()
    downvotes: UserEntity[];

    @OneToMany(()=>CommentEntity,comment=>comment.idea,{cascade:true})
    comments:CommentEntity[]
}