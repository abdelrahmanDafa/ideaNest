import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IdeaEntity } from "./entities/idea.entity";
import { Repository } from "typeorm";
import { CreateIdeaDto } from "./dto/createIdea.dto";
import { UpdateIdeaDto } from "./dto/updateIdea.dto";
import { UserEntity } from "../user/entities/user.entity";
import { Votes } from "../shared/votes.enum";


@Injectable()
export class IdeaService {

    constructor (
    @InjectRepository(IdeaEntity) 
    private ideaRepository:Repository<IdeaEntity>,
    @InjectRepository(UserEntity) 
    private userRepository:Repository<UserEntity>
    ){}

   async getIdeas(id?:number,page:number=1,limit:number=3){
        let where = {}
        if(id)
        where = {author:{id}}
        return await this.ideaRepository.find({
          where,
          take:limit,
          skip:limit*(page-1)
        })
    }

    async createIdea(id:number,ideaDto:CreateIdeaDto){
        
        const user = await this.userRepository.findOne({where:{id}})
        const idea = await this.ideaRepository.create(ideaDto)
        idea.author = user
        console.log("user",user);
        
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

    async updateSingleIdea(id:number,ideaDto:UpdateIdeaDto,userId:number){
      // await this.ideaRepository.update({id},ideaDto)
      const idea = await this.ideaRepository.findOne({   where:{id}} )
    //  Object.assign(idea,ideaDto)
      if(!idea){
        throw new NotFoundException("idea not found")
     }
     this.ensureOwnership(idea,userId)
     await this.ideaRepository.update({id},ideaDto)
     //idea.save()
      return idea  
    }

    async deleteSingleIdea(id:number,userId:number){
      const idea = await this.ideaRepository.findOne({where:{id}});
      if(!idea){
        throw new NotFoundException("idea not found")
     }
     this.ensureOwnership(idea,userId)
     await this.ideaRepository.delete({id});
     return idea;  
    }

   async bookmarkIdea(id:number,userId){
    const user = await this.userRepository.findOne(
      {
        where:{id:userId},
        relations:["bookmarks"]
      }
      )
    const idea = await this.ideaRepository.findOne({where:{id}})
    const isIdeaBookmarked = user.bookmarks.find((bookmark)=>bookmark.id === idea.id)
    if(isIdeaBookmarked)
    throw new BadRequestException("you already bookmared this idea")

    user.bookmarks.push(idea)
    await this.userRepository.save(user)
    return user
   }


   async unbookmarkIdea(id:number,userId){
    const user = await this.userRepository.findOne(
      {
        where:{id:userId},
        relations:["bookmarks"]
      }
      )
      const idea = await this.ideaRepository.findOne({where:{id}})
      const isIdeaBookmarked = user.bookmarks.find((bookmark)=>bookmark.id === idea.id)
      if(!isIdeaBookmarked)
      throw new BadRequestException("you already unbookmared this idea")

      user.bookmarks = user.bookmarks.filter(bookmark=> bookmark.id!==id)
      console.log("user.bookmarks",id,user.bookmarks);
      
      await this.userRepository.save(user)
      return user
   }


   private async vote(idea: IdeaEntity, user: UserEntity, vote: Votes) {
    const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;
    if (
      idea[opposite].filter(voter => voter.id === user.id).length > 0 ||
      idea[vote].filter(voter => voter.id === user.id).length > 0
    ) {
      idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id);
      idea[vote] = idea[vote].filter(voter => voter.id !== user.id);
      await this.ideaRepository.save(idea);
    } else if (idea[vote].filter(voter => voter.id === user.id).length < 1) {
      idea[vote].push(user);
      await this.ideaRepository.save(idea);
    } else {
      throw new BadRequestException("unable to vote")
    }

    return idea;
  }
  async toggleVote(id: number, userId: number,vote:Votes) {
    let idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes'],
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    idea = await this.vote(idea, user, vote);

    return idea;
  }

    private ensureOwnership(idea:IdeaEntity,ownerId:number){
        if(idea.author.id !== ownerId)
        throw new UnauthorizedException("This idea does not belong to you")
    }
}