import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

async function bootstrap(expressInstance: any) {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance));
  app.enableCors({ origin: '*' });
  await app.init();
}

bootstrap(server);
export default server;
