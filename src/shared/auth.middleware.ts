import { BadRequestException, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';

declare module "express" { 
    export interface Request {
      user: any
    }
  }
  
@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private userServcie:UserService,private configService:ConfigService){}
 async use(req: Request, res: Response, next: NextFunction) {
     try {
          if(req.headers.authorization)
          {
            const jwtSecret = this.configService.get("JWT_SECRET")    
            const token = req.headers.authorization.split(" ")[1];
            const decodedData:any =  jwt.verify(token,jwtSecret)
            const user = await this.userServcie.findUser(decodedData.username)
            req.user = user
          }
        next();
     } catch (error) {
        throw new UnauthorizedException("Invalid authentication token")
     } 
  } 
}