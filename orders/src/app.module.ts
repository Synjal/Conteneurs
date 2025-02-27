import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import {Order} from "./order/order.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod'
        ? join(__dirname, '../../.env.prod')
        : join(__dirname, '../../.env.test')
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT as string),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Order],
      synchronize: true,
    }),
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
