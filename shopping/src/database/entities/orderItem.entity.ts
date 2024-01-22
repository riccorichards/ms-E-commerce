import { IsNumber, IsString } from "class-validator";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Order from "./order.entity";

@Entity("orderItem")
class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNumber()
  productId: number;

  @Column()
  @IsString()
  product_name: string;

  @Column()
  @IsString()
  product_image: string;

  @Column()
  @IsString()
  product_address: string;

  @Column()
  @IsString()
  product_price: string;

  @Column()
  @IsNumber()
  qty: number;

  @ManyToOne(() => Order, (order) => order.orderItem)
  @JoinColumn({
    name: "order_id",
  })
  order: Order;
}

export default OrderItem;
