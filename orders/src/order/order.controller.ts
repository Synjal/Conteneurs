import {
    Controller,
    Inject,
    Delete,
    HttpCode,
    HttpStatus,
    Param, InternalServerErrorException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import axios from "axios";

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy,
        @Inject('CUSTOMER_SERVICE') private readonly customerClient: ClientProxy,
    ) {
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    async deleteOrder(@Param('id') orderId: string, @Response() res: any) {
        const order = await this.orderService.getOrder(orderId);
        const { productId, quantity } = order;
        // Delete the order
        await this.orderService.deleteOrder(orderId);
        try {

            await axios.patch(`http://localhost:3002/product/${productId}`, {
                quantity,
            });

            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Order deleted successfully and stock updated',
            });
        } catch (error) {
            console.error('Error updating product stock:', error.message);

            await this.orderService.createOrder(order);

            throw new InternalServerErrorException(
                'Failed to update stock, order rollback performed',
            );
        }
    }

}
