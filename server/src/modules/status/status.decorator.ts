import { SetMetadata } from '@nestjs/common';

export const Status = (...status: number[]) => SetMetadata('status', status);
