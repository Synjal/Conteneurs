import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string

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
