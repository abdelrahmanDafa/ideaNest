import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { IdeaService } from "./idea.service";
import { CreateIdeaDto } from "./dto/createIdea.dto";
import { UpdateIdeaDto } from "./dto/updateIdea.dto";


@Controller("idea")
export class IdeaController{

    constructor(private ideaService:IdeaService){}
    @Get()
    getAll(){
        return this.ideaService.getIdeas()
    }

    @Post()
    createSingleIdea(@Body() idea:CreateIdeaDto){
        return this.ideaService.createIdea(idea)
    }

    @Get(":id")
    getSingleIdea(@Param("id",ParseIntPipe) id:number){
      return this.ideaService.getSingleIdea(id)
    }

    @Put(":id")
    updateSingleIdea(
        @Param("id",ParseIntPipe) id:number,
        @Body() ideaDto:UpdateIdeaDto){
        return this.ideaService.updateSingleIdea(id,ideaDto)
    }
    @Delete(":id")
    deleteSingleIdea(@Param("id",ParseIntPipe) id:number){
        return this.ideaService.deleteSingleIdea(id)
    }
}