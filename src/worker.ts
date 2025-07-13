/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  console.log('Worker is running and listening for jobs...');
}
bootstrap().catch((err) => {
  console.error('Failed to bootstrap the application:', err);
  process.exit(1);
});
