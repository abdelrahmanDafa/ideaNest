import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ormConfig} from "./typeorm"
import { IdeaModule } from './idea/idea.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './shared/auth.middleware';
import { CommentModule } from './comment/comment.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    IdeaModule,
    UserModule,
    CommentModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide:APP_FILTER,
      useClass:HttpErrorFilter
    },
    {
      provide:APP_INTERCEPTOR,
      useClass:LoggingInterceptor
    },
    {
      provide:APP_INTERCEPTOR,
      useClass:ClassSerializerInterceptor
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware)
    .exclude(
      'auth/(.*)'
    )
    .forRoutes("*")
  }
}
