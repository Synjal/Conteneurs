import {
    Controller,
    Inject,
    Delete,
    HttpCode,
    HttpStatus,
    Param, InternalServerErrorException,
    Post,
    Body, ServiceUnavailableException, NotFoundException, BadRequestException, Res,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ClientProxy } from '@nestjs/microservices';
import axios from "axios";
import { Observable } from 'rxjs';
import {CreateOrderDto} from "./order.dto";

const GET_CUSTOMER = 'getCustomer';
const GET_BOOK = 'getBook';
const IS_BOOK_IN_STOCK = 'isBookInStock';
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
                .send(GET_CUSTOMER, {customerId})
            product = this.productClient.send(GET_BOOK, {productId});
        } catch (error) {
            throw new ServiceUnavailableException(
                'Service unavailable, please try again later',
            );
        }

        if (!customer) throw new NotFoundException('Customer not found');
        if (!product) throw new NotFoundException('Book not found');

        const isProductInStock = this.productClient
            .send(IS_BOOK_IN_STOCK, {productId, quantity});
        if (!isProductInStock)
            throw new BadRequestException('Not enough books in stock');

        const order = await this.orderService.createOrder(createOrderDto);
        this.productClient.emit(DECREASE_STOCK, { productId, quantity });

        return order;
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    async deleteOrder(@Param('id') orderId: string, @Res() res: any) {
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
