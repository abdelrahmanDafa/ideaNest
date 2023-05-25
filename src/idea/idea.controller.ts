import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { IdeaService } from "./idea.service";
import { CreateIdeaDto } from "./dto/createIdea.dto";
import { UpdateIdeaDto } from "./dto/updateIdea.dto";
import { AuthGuard } from "src/shared/auth.guard";
import { CurrentUser } from "src/user/decorators/current-user.decorator";


@UseGuards(AuthGuard)
@Controller("ideas")
export class IdeaController{

    constructor(private ideaService:IdeaService){}

    @Get()
    getAll(){
        return this.ideaService.getIdeas()
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
}