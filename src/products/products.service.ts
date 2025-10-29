import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {}

    findAll(): Promise<Product[]> {
        return this.productRepository.find();
    }
}
