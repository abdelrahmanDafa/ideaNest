import { IsString } from "class-validator";


export class CreateIdeaDto{
  @IsString()  
  idea:string;

  @IsString()
  description:string;
}