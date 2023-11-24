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

@Entity("payment")
class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @Length(3, 10)
  payment_method: string;

  @OneToOne(() => Transaction, { cascade: true })
  @JoinColumn()
  transaction: Transaction;

  @OneToOne(() => Order, { cascade: true })
  @JoinColumn()
  order: Order;
}

export default Payment;
