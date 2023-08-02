import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
//import {ormConfig} from "./typeorm"
import { IdeaModule } from './idea/idea.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './shared/auth.middleware';
import { CommentModule } from './comment/comment.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    ConfigModule.forRoot({
     //envFilePath: `./config/.${process.env.NODE_ENV || 'development'}.env`,
      envFilePath: './config/.development.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      //ormConfig,
     // useFactory:(configService:ConfigService)=>ormConfig(configService),
     useFactory:(configService: ConfigService)=>({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'haroon1010',
      database: 'ideas',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      migrationsTableName: "custom_migration_table",
      subscribers: ['src/subscriber/**/*{.ts,.js}'],
     }),
      inject: [ConfigService]
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        global:true
      }),
      inject: [ConfigService],
    }),
 /*    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('NODE_ENV') === 'test'
          ? configService.get<string>('MONGO_TEST_CONNECTION_URI')
          : configService.get<string>('MONGO_CONNECTION_URI')
      }),
      inject: [ConfigService]
    }), */
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
