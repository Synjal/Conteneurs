import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    productId: string

    @Column()
    customerId: string

    @Column()
    statusId: number

    @Column('int')
    quantity: number

    @Column('decimal')
    totalPrice: number
}
