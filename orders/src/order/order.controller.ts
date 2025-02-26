import {
    Controller,
    Post,
    Body,
    Inject,
    NotFoundException,
    BadRequestException,
    ServiceUnavailableException,
    Delete,
    HttpCode,
    HttpStatus,
    Param, InternalServerErrorException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from './order.dtos';
import { Observable } from 'rxjs';
import axios from "axios";

const GET_CUSTOMER = 'getCustomer';
const GET_PRODUCT = 'getproduct';
const IS_PRODUCT_IN_STOCK = 'isproductInStock';
const DECREASE_STOCK = 'DecreaseStock';

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy,
        @Inject('CUSTOMER_SERVICE') private readonly customerClient: ClientProxy,
    ) {
    }

    @Post('/')
    async createOrder(@Body() createOrderDto: CreateOrderDto) {
        const {productId, customerId, quantity} = createOrderDto;

        let customer: Observable<any>, product: Observable<any>;
        try {
            customer = this.customerClient
                .send(GET_CUSTOMER, {customerId});
            product = this.productClient.send(GET_PRODUCT, {productId});
        } catch (error) {
            throw new ServiceUnavailableException(
                'Service unavailable, please try again later',
            );
        }

        if (!customer) throw new NotFoundException('Customer not found');
        if (!product) throw new NotFoundException('Product not found');

        const isproductInStock = this.productClient
            .send(IS_PRODUCT_IN_STOCK, {productId, quantity});
        if (!isproductInStock)
            throw new BadRequestException('Not enough products in stock');

        const order = await this.orderService.createOrder(createOrderDto);
        this.productClient.emit(DECREASE_STOCK, { productId, quantity });

        return order;
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    async deleteOrder(@Param('id') orderId: string, @Response() res: any) {
        const order = await this.orderService.getOrder(orderId);
        const { productId, quantity } = order;
        // Delete the order
        await this.orderService.deleteOrder(orderId);
        try {

            // Http request to book service add back the book in stock
            await axios.patch(`http://localhost:3002/book/${productId}`, {
                quantity,
            });

            // Return success response if stock update was successful
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Order deleted successfully and stock updated',
            });
        } catch (error) {
            console.error('Error updating book stock:', error.message);

            // Rollback: Re-create the deleted order if stock update fails
            await this.orderService.createOrder(order);

            throw new InternalServerErrorException(
                'Failed to update stock, order rollback performed',
            );
        }
    }

}
