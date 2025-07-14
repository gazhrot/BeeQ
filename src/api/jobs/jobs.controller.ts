import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '../auth/auth.guard';
import { JobsService } from './jobs.service';
import { User } from '../auth/decorators/user.decorator';
import { User as UserModel } from '@prisma/client';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.ACCEPTED)
  async createNewJob(@User() user: UserModel) {
    const job = await this.jobsService.createJob(user);
    return {
      message: 'Job accepted',
      jobId: job.id,
    };
  }
}
