import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.CORS_ORIGIN, 
    methods: process.env.CORS_METHODS,
    credentials: true,
  });

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: process.env.MICROSERVICE_HOST || '0.0.0.0',
      port: parseInt(process.env.MICROSERVICE_PORT, 10) || 4001,
    },
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(parseInt(process.env.HTTP_PORT, 10) || 3000);  

  await app.startAllMicroservices();
  console.log('Admin Portal microservice is running');
}

bootstrap();