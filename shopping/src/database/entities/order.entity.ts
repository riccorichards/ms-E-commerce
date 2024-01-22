import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { IsNumber, IsString, Length } from "class-validator";
import OrderItem from "./orderItem.entity";

@Entity("orders")
class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @Length(3, 15)
  order_status: string;

  @Column({ type: "float" })
  @IsNumber()
  total_amount: number;

  @Column({ nullable: true })
  @IsString()
  deliverymanName: string;

  @Column()
  @IsString()
  customerId: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItem: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;
}

export default Order;
