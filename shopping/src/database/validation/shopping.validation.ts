import { IsEmail, IsNumber, IsString, Length } from "class-validator";

export class OrderInputValidation {
  @IsString()
  @Length(3, 100)
  username: string;

  @IsString()
  @Length(3, 100)
  @IsEmail()
  email: string;

  @IsString()
  @Length(3, 50)
  order_status: string;

  @IsString()
  @Length(3, 50)
  total_amount: string;
}

export class OrderItemInputValidation {
  @IsNumber()
  productId: number;

  @IsNumber()
  qty: number;

  @IsString()
  price: string;
}

export class ShippingInputValidation {
  @IsString()
  @Length(3, 100)
  full_name: string;

  @IsString()
  @Length(3, 100)
  company_name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  payment_method: string;

  @IsString()
  @Length(5, 150)
  mark: string;
}

export class AddressInputValidation {
  @IsString()
  @Length(3, 50)
  street: string;

  @IsString()
  @Length(3, 50)
  city: string;

  @IsString()
  @Length(3, 50)
  state: string;

  @IsString()
  @Length(3, 10)
  zip_code: string;

  @IsString()
  @Length(3, 50)
  country: string;
}

export class TransactionInputValidation {
  @IsString()
  @Length(1, 10)
  total_amount: string;

  @IsString()
  @Length(1, 10)
  currence: string;

  @IsString()
  @Length(1, 50)
  tnx_status: string;
}

export class PaymentInputValidation {
  @IsNumber()
  transactionId: number;

  @IsNumber()
  orderId: number;

  @IsString()
  payment_method: string;
}
