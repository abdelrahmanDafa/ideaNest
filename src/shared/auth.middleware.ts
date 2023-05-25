import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

declare module "express" { 
    export interface Request {
      user: any
    }
  }
  
@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private userServcie:UserService){}
 async use(req: Request, res: Response, next: NextFunction) {
     console.log('Auth Middleware...');;
    if(!req.headers.authorization)
    throw new BadRequestException("Not authenticated")
   try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedData:any = await jwt.verify(token,process.env.SECRET)
    const user = await this.userServcie.findUser(decodedData.username)
    req.user = user
    
   } catch (error) {
    
   }
   next();
  } 
}