import { Product } from '../../products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    order_id: number;

    @Column()
    product_id: number;

    @Column()
    quantity: number;

    @Column()
    currency: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => Product,  { eager: true })
    @JoinColumn({ name: 'product_id' })
    product: Product;
}
