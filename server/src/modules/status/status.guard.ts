import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { StatusEnum } from './status.enum';

@Injectable()
export class StatusGuard {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const status = this.reflector.getAllAndOverride<number[]>('status', [
      context.getClass(),
      context.getHandler(),
    ]);
    if (!status.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const statusId = String(request.user?.status?.id);

    if (!status.map(String).includes(statusId)) {
      return false;
    }

    return statusId === String(StatusEnum.active);
  }
}
