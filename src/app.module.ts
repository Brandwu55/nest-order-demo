import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'laravel',
      password: 'laravel',
      database: 'nest_order',
      autoLoadEntities: true,
      synchronize: false,
    }),OrdersModule
  ],
})
export class AppModule {}
