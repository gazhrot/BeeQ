import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './core/prisma.service';
import { createClient } from 'redis';
import { AuthModule } from './api/auth/auth.module';
import { seconds, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { JobsModule } from './api/jobs/jobs.module';
import { MessagingModule } from './core/messaging/messaging.module';
import { WorkersModule } from './workers/workers.module';
import { ApiKeyThrottlerGuard } from './core/guards/api-key-throttler.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            limit: 10, // 10 requêtes max
            ttl: seconds(60), // par 60 secondes
          },
        ],
        // On configure le stockage en lui passant l'URL de connexion à Redis
        // construite à partir de vos variables d'environnement.
        storage: new ThrottlerStorageRedisService(
          `redis://${config.get('REDIS_HOST')}:${config.get('REDIS_PORT')}`,
        ),
      }),
    }),
    MessagingModule,
    AuthModule,
    JobsModule,
    WorkersModule,
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
    {
      provide: APP_GUARD,
      useClass: ApiKeyThrottlerGuard,
    },
  ],
})
export class AppModule {}
