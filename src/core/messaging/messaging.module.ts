import { Global, Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('RABBITMQ_URI');
        if (!uri) {
          throw new Error('RABBITMQ_URI is not defined in .env');
        }
        return {
          exchanges: [{ name: 'amq.direct', type: 'direct' }],
          uri: uri,
          connectionInitOptions: { wait: false },
        };
      },
    }),
  ],
  exports: [RabbitMQModule],
})
export class MessagingModule {}
