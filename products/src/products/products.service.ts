import {Injectable, NotFoundException} from '@nestjs/common';
import {Product} from './products.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async getProduct(productId: { productId: string }): Promise<Product | null> {
        return await this.productRepository.findOne({ where: { id: productId.productId } });
    }


    async isProductInStock(productId: string, quantity: number): Promise<boolean> {
        const product = await this.productRepository.findOne({ where: { id: productId } });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return quantity <= product.stock;
    }


    async decreaseStock(productId: string, quantity: number): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id: productId } });

        if (!product) {
            throw new NotFoundException('product not found');
        }
        product.stock -= quantity;
        return await this.productRepository.save(product);
    }

    async increaseStock(productId: string, quantity: number): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id: productId } });

        if (!product) {
            throw new NotFoundException('Book not found');
        }

        console.log('Increasing stock for book:', product);
        product.stock += quantity;
        return await this.productRepository.save(product);
    }

}
