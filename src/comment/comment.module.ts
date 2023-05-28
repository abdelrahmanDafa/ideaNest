import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { IdeaEntity } from '../idea/entities/idea.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([CommentEntity,IdeaEntity,UserEntity])],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
