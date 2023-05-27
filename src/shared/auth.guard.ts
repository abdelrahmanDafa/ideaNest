import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";


export class AuthGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        console.log("from auth guard : ",request.user);
        
        if(!request.user)
        throw new UnauthorizedException("Not Authorized")
        return  request.user
        ?true
        :false
         
    }
}