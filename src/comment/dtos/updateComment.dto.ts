import { PartialType } from "@nestjs/mapped-types";
import { CreateCommentDto } from "./creatCommentDto";


export class UpdateCommentDto extends PartialType(CreateCommentDto){}