import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../core/prisma.service';
import {
  ApiKeyMissingException,
  InvalidApiKeyException,
} from 'src/core/exceptions';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new ApiKeyMissingException();
    }

    if (Array.isArray(apiKey)) {
      throw new BadRequestException('API key header must not be an array.');
    }

    const user = await this.prisma.user.findUnique({
      where: { apiKey: apiKey },
    });

    if (!user) {
      throw new InvalidApiKeyException();
    }

    request.user = user;
    return true;
  }
}
