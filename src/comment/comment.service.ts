import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { IdeaEntity } from '../idea/entities/idea.entity';
import { CreateCommentDto } from './dtos/creatCommentDto';
import { UserEntity } from '../user/entities/user.entity';
import { UpdateCommentDto } from './dtos/updateComment.dto';

@Injectable()
export class CommentService {

    constructor(
        @InjectRepository(CommentEntity) private commentRepository:Repository<CommentEntity>,
        @InjectRepository(IdeaEntity) private IdeaRepository:Repository<IdeaEntity>,
        @InjectRepository(UserEntity) private userRepository:Repository<UserEntity>
        ){}
    
    async getIdeaComments(id:number){
        const idea = await this.IdeaRepository.findOne({where:{id},relations:["author","comments"]})
        if(!idea)
        throw new NotFoundException("idea not found")
        return idea;
    }

    async createIdeaComment(
        id:number,
        userId:number,
        commentDto:CreateCommentDto
    ){
      const idea = await this.IdeaRepository.findOne({where:{id}})
      const author = await this.userRepository.findOne({where:{id:userId}})

      if(!idea)
      throw new NotFoundException("Idea not found")

      if(!author)
      throw new NotFoundException("User not found")

      const comment = await this.commentRepository.create({
        ...commentDto,
        idea,
        author
      })
      await this.commentRepository.save(comment)
      return comment
    }

    async getComment(id:number,userId){
      const comment = await this.commentRepository.findOne({where:{id}})
      if(!comment)
      throw new NotFoundException("Comment not found");
      return comment
    }

    async updateComment(id:number,userId:number,commentDto:UpdateCommentDto){
        const comment = await this.commentRepository.findOne({where:{id},relations:["author"]})
        const author = await this.userRepository.findOne({where:{id:userId}})
        if(!comment)
        throw new NotFoundException("Comment not found")
        this.ensureOwnership(comment,userId)
        await this.commentRepository.update({id},commentDto)
        return comment
      }
      async deleteteComment(id:number,userId:number){
        const comment = await this.commentRepository.findOne({where:{id},relations:["author"]})
        const author = await this.userRepository.findOne({where:{id:userId}})
        if(!comment)
        throw new NotFoundException("Comment not found")
        this.ensureOwnership(comment,userId)
        await this.commentRepository.delete({id})
        return comment
      }

      private ensureOwnership(comment:CommentEntity,ownerId:number){
        if(comment.author.id !== ownerId)
        throw new UnauthorizedException("This idea does not belong to you")
    }
}
