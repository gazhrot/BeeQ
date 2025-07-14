import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from './core/prisma.service';
import { RedisClientType } from 'redis';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  getHello(): string {
    return 'Hello World! Your app is running.';
  }

  async getHealth() {
    const healthStatus = {
      postgres: 'down',
      redis: 'down',
      rabbitmq: 'down',
      timestamp: new Date().toISOString(),
    };

    // 1. PostgreSQL Test
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      healthStatus.postgres = 'ok';
    } catch (error) {
      console.error('Postgres health check failed:', error);
    }

    // 2. Redis Test
    try {
      const pong = await this.redis.ping();
      if (pong === 'PONG') {
        healthStatus.redis = 'ok';
      }
    } catch (error) {
      console.error('Redis health check failed:', error);
    }

    // 3. RabbitMQ Test
    try {
      await this.amqpConnection.publish('amq.direct', 'health_check', {
        status: 'ok',
      });
      healthStatus.rabbitmq = 'ok';
    } catch (error) {
      console.error('RabbitMQ health check failed:', error);
    }

    return healthStatus;
  }
}
