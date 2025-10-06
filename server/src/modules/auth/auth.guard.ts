import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    
    const accessToken = req.cookies?.['accessToken'];

    if (accessToken) {
      req.headers.authorization = `Bearer ${accessToken}`;
    }

    return req;
  }
}
