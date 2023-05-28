import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { IdeaService } from "./idea.service";
import { CreateIdeaDto } from "./dto/createIdea.dto";
import { UpdateIdeaDto } from "./dto/updateIdea.dto";
import { AuthGuard } from "../shared/auth.guard";
import { CurrentUser } from "../user/decorators/current-user.decorator";
import { Votes } from "../shared/votes.enum";


@UseGuards(AuthGuard)
@Controller("ideas")
export class IdeaController{

    constructor(private ideaService:IdeaService){}

    @Get()
    getAll(
        @Query("page") page:number,
        @Query("skip") skip:number
    ){

        return this.ideaService.getIdeas(null,page,skip)
    }

    @Get("mine")
    getMyIdeas(@CurrentUser('id') userId:number){
        return this.ideaService.getIdeas(userId)
    }


    @Post()
    createSingleIdea(@CurrentUser('id') userId:number, @Body() idea:CreateIdeaDto){
        return this.ideaService.createIdea(userId,idea)
    }

    @Get(":id")
    getSingleIdea(@Param("id",ParseIntPipe) id:number){
      return this.ideaService.getSingleIdea(id)
    }

    @Put(":id")
    updateSingleIdea(
        @Param("id",ParseIntPipe) id:number,
        @CurrentUser('id') userId:number,
        @Body() ideaDto:UpdateIdeaDto){
        return this.ideaService.updateSingleIdea(id,ideaDto,userId)
    }
    @Delete(":id")
    deleteSingleIdea(
        @Param("id",ParseIntPipe) id:number,
        @CurrentUser('id') userId:number,
        ){
        return this.ideaService.deleteSingleIdea(id,userId)
    }

    @Post(":id/bookmark")
    bookmarkIdea(
        @Param("id",ParseIntPipe) id:number,
        @CurrentUser('id') userId:number,
    ){
       return this.ideaService.bookmarkIdea(id,userId)
    }

    @Delete(":id/bookmark")
    unbookmarkIdea(
        @Param("id",ParseIntPipe) id:number,
        @CurrentUser('id') userId:number,
    ){
        return this.ideaService.unbookmarkIdea(id,userId)
    }


    @Post(":id/vote")
    upvoteIdea(
        @Param("id",ParseIntPipe) id:number,
        @CurrentUser('id') userId:number,
    ){
       return this.ideaService.toggleVote(id,userId,Votes.UP)
    }

    @Delete(":id/vote")
    downvoteIdea(
        @Param("id",ParseIntPipe) id:number,
        @CurrentUser('id') userId:number,
    ){
        return this.ideaService.toggleVote(id,userId,Votes.DOWN)
    }
}