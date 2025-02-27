import { Controller } from '@nestjs/common';
import { Payload, MessagePattern } from '@nestjs/microservices';
import { CustomerService } from './customer.service';

const GET_CUSTOMER = 'getCustomer';

@Controller('customer')
export class CustomerController {
    constructor(
        private readonly customerService: CustomerService
    ) {}

    @MessagePattern(GET_CUSTOMER)
    async handleGetCustomer(@Payload() data: { customerId: number }) {
        const { customerId } = data;
        return await this.customerService.getCustomer(customerId);
    }
}
