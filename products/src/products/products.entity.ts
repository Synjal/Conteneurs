import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    categoryId: string

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    price: number

    @Column()
    stock: number

    @Column()
    imageUrl: string

    @Column()
    isOnSale: boolean
}
