import {Body, Controller, Param, Patch} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
    Payload,
    MessagePattern,
    EventPattern,
} from '@nestjs/microservices';
import { Product } from './products.entity';

const GET_PRODUCT = 'getProduct';
const IS_PRODUCT_IN_STOCK = 'isProductInStock';
const DECREASE_STOCK = 'DecreaseStock';

@Controller('product')
export class ProductController {
    constructor(
        private readonly ProductService: ProductsService
    ) {}

    @MessagePattern(GET_PRODUCT)
    async handleGetProduct(@Payload() data: { productId: string }) {
        return await this.ProductService.getProduct(data);
    }

    @MessagePattern(IS_PRODUCT_IN_STOCK)
    async handleIsProductInStock(
        @Payload() data: { productId: string; quantity: number },
    ): Promise<boolean> {
        const { productId, quantity } = data;
        return await this.ProductService.isProductInStock(productId, quantity);
    }

    @EventPattern(DECREASE_STOCK)
    async handleDecreaseStock(
        @Payload() data: { productId: string; quantity: number },
    ): Promise<Product> {
        const { productId, quantity } = data;
        return await this.ProductService.decreaseStock(productId, quantity);
    }

    @Patch('/:id')
    async increaseStock(
        @Param('id') bookId: string,
        @Body() body: { quantity: number },
    ) {
        const { quantity } = body;
        console.log('Increase stock request received:', bookId, quantity);
        return await this.ProductService.increaseStock(bookId, quantity);
    }

}
