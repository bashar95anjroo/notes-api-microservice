import { NestFactory } from '@nestjs/core';
import { NotesModule } from './notes.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await NestFactory.create(NotesModule);
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
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
}
bootstrap();
