import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { PrismaService } from '../../core/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthGuard, PrismaService],
})
export class AuthModule {}
