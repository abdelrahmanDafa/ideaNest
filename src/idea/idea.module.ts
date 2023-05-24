import { Module } from "@nestjs/common";
import { IdeaController } from "./idea.controller";
import { IdeaService } from "./idea.service";
import { IdeaEntity } from "./entities/idea.entity";
import { TypeOrmModule } from "@nestjs/typeorm";


@Module({
    imports:[
        TypeOrmModule.forFeature([IdeaEntity])
    ],
    controllers:[IdeaController],
    providers:[IdeaService]
})
export class IdeaModule{}