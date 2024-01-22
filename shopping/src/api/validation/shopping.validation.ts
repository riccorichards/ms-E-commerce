import {
  ArrayNotEmpty,
  IsEmail,
  IsNumber,
  IsString,
  Length,
  ValidateNested,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";

export class OrderItemInputValidation {
  @IsNumber()
  productId: number;

  @IsNumber()
  qty: number;

  @IsString()
  product_name: string;

  @IsString()
  product_address: string;

  @IsString()
  product_image: string;

  @IsString()
  product_price: string;
}

export class OrderInputValidation {
  @IsNumber()
  total_amount: number;

  @IsString()
  customerId: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputValidation)
  cartItems: OrderItemInputValidation[];
}

export class ShippingInputValidation {
  @IsString()
  @Length(5, 100)
  username: string;

  @IsString()
  @IsEmail()
  @Length(5, 100)
  email: string;

  @IsNumber()
  orderId: number;

  @IsString()
  personName: string;

  @IsString()
  @Length(5, 100)
  address: string;

  @IsString()
  @Length(1, 100)
  payment_method: string;

  @IsString()
  @Length(16)
  debit_card: string;

  @IsString()
  @Length(5, 250)
  note: string;
}

export interface queryParamsType {
  address?: string;
  customerId?: string;
}
