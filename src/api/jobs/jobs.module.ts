import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { PrismaService } from '../../core/prisma.service';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

@Module({
  controllers: [JobsController],
  providers: [
    JobsService,
    PrismaService,
    makeCounterProvider({
      name: 'beeq_jobs_created_total',
      help: 'Total number of jobs created.',
    }),
  ],
})
export class JobsModule {}
