import {IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested, Matches, IsInt, ValidateIf} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {

    @IsNumber()
    @Type(() => Number)
    product_id: number;

    @IsNotEmpty({ message: '價格不能為空' })
    @IsNumber()
    @Type(() => Number)
    price: string;

    @IsNotEmpty({ message: '數量不能為空' })
    @IsNumber()
    @Type(() => Number)
    quantity: number;

    @IsNotEmpty({ message: '幣種不能為空' })
    @IsString()
    currency: string;
}

export class CreateOrderDto {
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    user_id: number;

    @IsNotEmpty({ message: '手機號不能為空' })
    @ValidateIf(o => o.customer_phone !== '')  // 只有不为空时才执行 Matches
    @Matches(/^09\d{8}$/, {
        message: '手機號格式不正確（台灣09開頭10位）',
    })
    customer_phone: string;

    @IsNotEmpty({ message: '聯繫地址不能為空' })
    @IsString()
    customer_address: string;

    @IsNotEmpty({ message: '支付方式不能為空' })
    @IsString()
    payment_method: string;

    @IsNotEmpty({ message: '幣種不能為空' })
    @IsString()
    currency: string;

    @IsNotEmpty({ message: '狀態不能為空' })
    @IsString()
    status: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];
}
