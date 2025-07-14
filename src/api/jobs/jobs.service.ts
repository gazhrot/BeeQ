import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { User } from '@prisma/client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@Injectable()
export class JobsService {
  constructor(
    private prisma: PrismaService,
    private amqpConnection: AmqpConnection,
    @InjectMetric('beeq_jobs_created_total')
    public jobsCounter: Counter<string>,
  ) {}

  async createJob(user: User) {
    this.jobsCounter.inc();
    // 1. Create job in DB with status 'pending'
    const job = await this.prisma.job.create({
      data: {
        type: 'BASIC_JOB',
        status: 'pending',
        payload: { message: `Job created at ${new Date().toISOString()}` },
        webhookUrl: 'http://example.com/webhook', // fake url for now
        userId: user.id,
      },
    });

    // 2. Publish job ID in RabbitMQ
    await this.amqpConnection.publish(
      'amq.direct', // exchange name
      'jobs.new', // routing key
      { jobId: job.id }, // message
    );

    return job;
  }
}
