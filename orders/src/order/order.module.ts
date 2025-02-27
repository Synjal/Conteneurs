import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Order} from "./order.entity";
import { RabbitmqModule } from 'src/rabbitmq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    RabbitmqModule,
  ],
  exports: [OrderService],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
