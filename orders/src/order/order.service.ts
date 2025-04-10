import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { Order } from './order.entity';
import { CreateOrderDto } from './order.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
    ) {}

    async createOrder(createOrderDto: CreateOrderDto) {
        const order = this.orderRepository.create(createOrderDto);
        return this.orderRepository.save(order);
    }

    async getOrder(orderId: string): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
        });
        if (!order) {
            throw new NotFoundException('Order ${orderId} not found');
        }
        return order;
    }

    async deleteOrder(
        orderId: string,
    ): Promise<{ statusCode: HttpStatus; message: string }> {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        await this.orderRepository.delete(orderId);

        return {
            statusCode: HttpStatus.OK,
            message: 'Order deleted successfully',
        };
    }
}
