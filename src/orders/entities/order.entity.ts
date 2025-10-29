import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
    BeforeInsert,
    CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from '../../users/entities/user.entity';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    order_number: string;

    @Column({ nullable: true })
    user_id: number;

    @Column({ nullable: true })
    customer_phone: string;

    @Column({ nullable: true })
    customer_address: string;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    total_amount: number;

    @Column({ length: 10, default: 'CNY' })
    currency: string;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    discount_amount: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    pay_amount: number;

    @Column({ nullable: true })
    payment_method: string;

    @Column({
        type: 'enum',
        enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled'],
        default: 'pending',
    })
    status: string;

    @Column({ type: 'timestamp', nullable: true })
    paid_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    shipped_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    completed_at: Date;

    @Column({ type: 'text', nullable: true })
    remarks: string;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];

    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @BeforeInsert()
    generateOrderNumber() {
        const timestamp = Date.now(); // 毫秒时间戳
        const random = Math.floor(Math.random() * 1000) + 1; // 1~1000 随机数
        this.order_number = `ORD-${timestamp}${random}`;
    }

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updated_at: Date;
}
