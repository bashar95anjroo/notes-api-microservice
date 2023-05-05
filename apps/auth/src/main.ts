import { NestFactory } from '@nestjs/core';
import { RmqService } from '@app/common';
import { AuthModule } from './auth.module';
import { RmqOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  Sentry.init({
    dsn: 'https://583eb91eb1514784b899e272c5bcead8@o4505131291049984.ingest.sentry.io/4505131295637504',
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
  const transaction = Sentry.startTransaction({
    op: 'test',
    name: 'My First Test Transaction',
  });
  setTimeout(() => {
    try {
      // foo();
    } catch (e) {
      Sentry.captureException(e);
    } finally {
      transaction.finish();
    }
  }, 99);
  const rmqService = app.get<RmqService>(RmqService);
  // app.connectMicroservice<RmqOptions>(rmqService.getOptions('AUTH', true));
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
