import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IdeaEntity } from "./entities/idea.entity";
import { Repository } from "typeorm";
import { CreateIdeaDto } from "./dto/createIdea.dto";
import { UpdateIdeaDto } from "./dto/updateIdea.dto";


@Injectable()
export class IdeaService {

    constructor (
    @InjectRepository(IdeaEntity) 
    private ideaRepository:Repository<IdeaEntity>
    ){}
   async getIdeas(){
        return await this.ideaRepository.find()
    }

    async createIdea(ideaDto:CreateIdeaDto){
        console.log("ideaDto",ideaDto);
        
        const idea = await this.ideaRepository.create(ideaDto)
        await this.ideaRepository.save(idea)
        return idea;
    }

    async getSingleIdea(id:number){
      const idea = await this.ideaRepository.findOne({where:{id}})
      if(!idea){
         throw new NotFoundException("idea not found")
      }
      return idea
    }
    async updateSingleIdea(id:number,ideaDto:UpdateIdeaDto){
      // await this.ideaRepository.update({id},ideaDto)
      const idea = await this.ideaRepository.findOne({where:{id}})
    //  Object.assign(idea,ideaDto)
      if(!idea){
        throw new NotFoundException("idea not found")
     }
     await this.ideaRepository.update({id},ideaDto)
     //idea.save()
      return idea  
    }
    async deleteSingleIdea(id:number){
      const idea = await this.ideaRepository.findOne({where:{id}});
      if(!idea){
        throw new NotFoundException("idea not found")
     }
     await this.ideaRepository.delete({id});
      return idea;  
    }
}