import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Order from "./order.entity";
import Shipping from "./shipping.entity";

@Entity("invoice")
class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

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
