import { IsNumber, IsString } from "class-validator";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Order from "./order.entity";
import Shipping from "./shipping.entity";

@Entity("vendor")
class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  vendorId: string;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  profileImg: string;

  @Column()
  @IsString()
  vendorAddress: string;

  @Column()
  @IsNumber()
  rating: number;

  @Column()
  @IsNumber()
  feedsAmount: number;

  @OneToOne(() => Shipping, (shipping) => shipping.vendor)
  shipping: Shipping;
}

export default Vendor;
