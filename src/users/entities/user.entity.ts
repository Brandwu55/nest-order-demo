import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

}