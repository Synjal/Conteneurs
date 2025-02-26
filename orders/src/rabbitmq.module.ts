import { ClientsModule, Transport } from '@nestjs/microservices';
import { Module } from "@nestjs/common";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'PRODUCT_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [
                        'amqps://mtlesmbb:pjoNg1892khYVDcSg2nXGXK6aFXeOyFy@seal.lmq.cloudamqp.com/mtlesmbb',
                    ],
                    queue: 'product_queue',
                    queueOptions: { durable: false },
                }
            },
            {
                name: 'ORDER_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [
                        'amqps://mtlesmbb:pjoNg1892khYVDcSg2nXGXK6aFXeOyFy@seal.lmq.cloudamqp.com/mtlesmbb',
                    ],
                    queue: 'order_queue',
                    queueOptions: { durable: false },
                }
            },
            {
                name: 'CUSTOMER_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [
                        'amqps://mtlesmbb:pjoNg1892khYVDcSg2nXGXK6aFXeOyFy@seal.lmq.cloudamqp.com/mtlesmbb',
                    ],
                    queue:'customer_queue',
                    queueOptions: { durable: false },
                }
            }
        ])
    ],
    exports: [ClientsModule]
})
export class RabbitmqModule {}
