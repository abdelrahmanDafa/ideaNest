import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const CurrentUser = createParamDecorator((attr,ctx:ExecutionContext)=>{
    const request = ctx.switchToHttp().getRequest();
    return attr
    ? request.user[attr] 
    :  request.user
})