import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    email: string

    @Column()
    phone: string

    @Column()
    isActive: boolean

    @Column()
    is_deleted: boolean
}
