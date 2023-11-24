import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from "typeorm";
import { IsEmail, IsString, Length } from "class-validator";
import OrderItem from "./orderItem.entity";
import Payment from "./payment.entity";

@Entity("order")
class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @Length(5, 100)
  username: string;

  @Column()
  @IsString()
  @IsEmail()
  @Length(5, 100)
  email: string;

  @Column()
  @IsString()
  order_status: string;

  @Column()
  @IsString()
  total_amount: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItem: OrderItem[];

  @OneToOne(() => Payment, (payment) => payment.order)
  payment: Payment;
}

export default Order;
