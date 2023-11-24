import { IsNumber, IsString } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Order from "./order.entity";

@Entity("orderItem")
class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNumber()
  productId: number;

  @Column()
  @IsNumber()
  qty: number;

  @Column()
  @IsString()
  price: string;

  @ManyToOne(() => Order, (order) => order.orderItem)
  order: Order;
}

export default OrderItem;
