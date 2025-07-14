import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma.service';

// fake treatment
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Injectable()
export class JobsConsumer {
  constructor(private prisma: PrismaService) {}

  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'jobs.new',
    queue: 'jobs_queue', // queue name
  })
  public async handleNewJob(msg: { jobId: string }) {
    console.log(`[WORKER] Received job with ID: ${msg.jobId}`);

    await this.prisma.job.update({
      where: { id: msg.jobId },
      data: { status: 'processing' },
    });

    // Simulate job
    console.log(`[WORKER] Processing job ${msg.jobId}...`);
    await sleep(5000);

    await this.prisma.job.update({
      where: { id: msg.jobId },
      data: { status: 'completed' },
    });

    console.log(`[WORKER] Job ${msg.jobId} completed!`);
  }
}
