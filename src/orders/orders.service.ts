import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Between, LessThanOrEqual, Like, MoreThanOrEqual, Repository, DataSource} from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>,

        @InjectRepository(OrderItem)
        private readonly orderItemRepo: Repository<OrderItem>,

        private readonly dataSource: DataSource,
    ) {}

    async deleteOrder(orderId: number) {
        return await this.dataSource.transaction(async (manager) => {

            // 先删子表 — 必须按外键字段删除
            await manager.getRepository(OrderItem).delete({ order: { id: orderId } });

            // 再删主表
            const result = await manager.getRepository(Order).delete(orderId);

            return result;
        });
        // // 先删子表
        // await this.orderItemRepo.delete(orderId);
        //
        // // 再删主表
        // const deleted = await this.orderRepo.delete(orderId);
        //
        // return deleted;
    }

    async updateStatus(orderId: number, status: string, remark: string) {
        const order = await this.orderRepo.findOneBy({ id: orderId });
        if (!order) {
            throw new Error('订单不存在');
        }

        order.status = status;
        order.remarks = remark;
        await this.orderRepo.save(order);
        return order;
    }

    async create(dto: CreateOrderDto): Promise<Order | null> {
        const { items, ...orderData } = dto;

        return this.dataSource.transaction(async (manager) => {
            // 计算总金额和币种
            let totalAmount = 0;
            let currency: string = '';

            if (items && items.length > 0) {
                totalAmount = items.reduce((sum, item) => {
                    const price = Number(item.price) || 0;
                    const qty = Number(item.quantity) || 0;
                    return sum + price * qty;
                }, 0);
                currency = items[0].currency || 'TWD';
            }

            // 创建主订单
            const order = manager.create(Order, {
                ...orderData,
                total_amount: totalAmount,
                currency,
            });
            await manager.save(order);

            // 创建明细
            const orderItems = items.map((item) => {
                return manager.create(OrderItem, {
                    ...item,
                    order,
                });
            });
            await manager.save(orderItems);

            // 返回带明细的订单
            return manager.findOne(Order, {
                where: { id: order.id },
                relations: ['items'],
            });
        });
    }

    async findAll(filters?: { orderNumber?: string; status?: string; dateFrom?: string; dateTo?: string;  }): Promise<Order[]> {
        const where: any = {};

        // 模糊匹配订单号
        if (filters?.orderNumber) {
            where.order_number = Like(`%${filters.orderNumber}%`);
        }

        // 精确匹配状态
        if (filters?.status) {
            where.status = filters.status;
        }

        // 日期范围过滤
        if (filters?.dateFrom && filters?.dateTo) {
            where.created_at = Between(filters.dateFrom, filters.dateTo);
        } else if (filters?.dateFrom) {
            where.created_at = MoreThanOrEqual(filters.dateFrom);
        } else if (filters?.dateTo) {
            where.created_at = LessThanOrEqual(filters.dateTo);
        }

        return this.orderRepo.find({
            where,
            relations: ['user', 'items'],
            order: { id: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Order> {
        const order = await this.orderRepo.findOneBy({ id });
        if (!order) throw new NotFoundException(`Order #${id} not found`);
        return order;
    }

    async findOrderItems(orderId: number) {
        return this.orderItemRepo.find({
            where: { order: { id: orderId } },
            relations: ['product'],
        });
    }

    async update(id: number, dto: UpdateOrderDto): Promise<Order> {
        const order = await this.findOne(id);
        Object.assign(order, dto);
        return await this.orderRepo.save(order);
    }

    async remove(id: number): Promise<void> {
        const order = await this.findOne(id);
        await this.orderRepo.remove(order);
    }
}
