import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  app.enableShutdownHooks();
  console.log('Worker is running and listening for jobs...');
  await new Promise(() => {});
}
bootstrap().catch((err) => {
  console.error('Failed to bootstrap the application:', err);
  process.exit(1);
});
