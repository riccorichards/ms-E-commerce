import { IsString, Length } from "class-validator";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Transaction from "./transaction.entity";
import Order from "./order.entity";
import Shipping from "./shipping.entity";

@Entity("invoice")
class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @Length(3, 10)
  payment_method: string;

  @OneToOne(() => Transaction, { cascade: true })
  @JoinColumn({
    name: "transaction_id",
  })
  transaction: Transaction;

  @OneToOne(() => Order, { cascade: true })
  @JoinColumn({
    name: "order_id",
  })
  order: Order;

  @OneToOne(() => Shipping, { cascade: true })
  @JoinColumn({
    name: "shipping_id",
  })
  shipping: Shipping;
}

export default Invoice;
