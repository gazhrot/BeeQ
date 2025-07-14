import { Module } from '@nestjs/common';
import { JobsConsumer } from './jobs.consumer';
import { PrismaService } from '../core/prisma.service';

@Module({
  providers: [JobsConsumer, PrismaService],
})
export class WorkersModule {}
