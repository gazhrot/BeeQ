import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './core/prisma.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { createClient } from 'redis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('RABBITMQ_URI');
        if (!uri) {
          throw new Error('.env RABBITMQ_URI is undefined');
        }
        return {
          exchanges: [
            {
              name: 'amq.direct',
              type: 'direct',
            },
          ],
          uri: uri,
          connectionInitOptions: { wait: false },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const client = createClient({
          url: `redis://${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`,
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
