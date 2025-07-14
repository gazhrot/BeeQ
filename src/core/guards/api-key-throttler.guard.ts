import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyThrottlerGuard extends ThrottlerGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // if context is not HTTP (ex: RPC/RabbitMQ, WebSocket)
    // we disable guard for this execution
    if (context.getType() !== 'http') {
      return true;
    }

    return super.canActivate(context);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  protected async getTracker(req: Request): Promise<string> {
    // this methods only called in HTTP context
    return req.headers['x-api-key']?.toString() || (req.ip as string);
  }
}
