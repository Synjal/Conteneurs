import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    productId: string

    @Column()
    customerId: number

    @Column()
    statusId: number

    @Column()
    quantity: number

    @Column()
    totalPrice: number

    @Column()
    billingMethod: string
}
