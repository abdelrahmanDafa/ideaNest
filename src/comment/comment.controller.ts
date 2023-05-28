import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../shared/auth.guard';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/creatCommentDto';
import { UpdateCommentDto } from './dtos/updateComment.dto';

@UseGuards(AuthGuard)
@Controller('/comments')
export class CommentController {

    constructor(private commentService:CommentService){}


    @Get("/idea/:id")
    getIdeaComments(
        @Param("id",ParseIntPipe) id:number,
        @CurrentUser("id") userId:number
    ){
     return this.commentService.getIdeaComments(id)
    }
    @Post("/idea/:id")
    createIdeaComment(
        @Param("id",ParseIntPipe) id:number,
        @CurrentUser("id",ParseIntPipe) userId:number,
        @Body() commentDto:CreateCommentDto
    ){
     return this.commentService.createIdeaComment(id,userId,commentDto)
    }

    @Get("/:id")
    getComment(
        @Param("id",ParseIntPipe) id:number,
        @CurrentUser("id") userId:number
    ){
      return this.commentService.getComment(id,userId)
    }
    @Put("/:id")
    updateComment(
        @Param("id",ParseIntPipe) id:number,
        @CurrentUser("id") userId:number,
        @Body() commentDto:UpdateCommentDto
    ){
     return this.commentService.updateComment(id,userId,commentDto)
    }
    @Delete("/:id")
    deleteComment(
        @Param("id",ParseIntPipe) id:number,
        @CurrentUser("id") userId:number
    ){
        return this.commentService.deleteteComment(id,userId)
    }
}
