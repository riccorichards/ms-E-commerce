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
import { IsEmail, IsString, Length } from "class-validator";
import OrderItem from "./orderItem.entity";
import Invoice from "./invoice.entity";
import Deliveryman from "./deliveryman.entity";
import Vendor from "./vendor.entity";

@Entity("orders")
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
  @IsEmail()
  @Length(5, 100)
  customerAddress: string;

  @Column()
  @IsString()
  order_status: string;

  @Column()
  @IsString()
  distance: string;

  @Column()
  @IsString()
  duration: string;

  @Column({ nullable: true })
  @IsString()
  total_amount: string;

  @Column({ nullable: true })
  @IsString()
  note: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItem: OrderItem[];

  @OneToOne(() => Invoice, (invoice) => invoice.order)
  invoice: Invoice;

  @OneToOne(() => Deliveryman, { cascade: true })
  @JoinColumn({
    name: "deliveryman_id",
  })
  deliverymna: Deliveryman;

  @OneToOne(() => Vendor, { cascade: true })
  @JoinColumn({
    name: "vendor_id",
  })
  vendor: Vendor;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default Order;
