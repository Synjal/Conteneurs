import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const RABBITMQ_URL = 'amqps://mtlesmbb:pjoNg1892khYVDcSg2nXGXK6aFXeOyFy@seal.lmq.cloudamqp.com/mtlesmbb';
  app.enableCors();
  await app.listen(process.env.PORT ?? 3001);

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URL],
      queue: 'order_queue',
      queueOptions: { durable: false },
    },
  });

  await microservice.listen();
}
bootstrap();
