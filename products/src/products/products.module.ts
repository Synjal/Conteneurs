import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Product} from "./products.entity";
import { RabbitmqModule } from '../rabbitmq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    RabbitmqModule,
  ],
  exports: [ProductsService],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {}
