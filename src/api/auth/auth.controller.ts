import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { ProfileResponse } from './types/auth.types';
import { User } from './decorators/user.decorator';
import { User as UserModel } from '@prisma/client';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@User() user: UserModel): ProfileResponse | undefined {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
