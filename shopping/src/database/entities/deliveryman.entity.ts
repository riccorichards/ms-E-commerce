import { IsDate, IsNumber, IsString } from "class-validator";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Shipping from "./shipping.entity";

@Entity("deliveryman")
class Deliveryman {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNumber()
  deliverymanId: number;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  image: string;

  @Column()
  @IsNumber()
  rating: number;

  @Column()
  @IsDate()
  sinceAt: Date;

  @OneToOne(() => Shipping, (shipping) => shipping.vendor)
  shipping: Shipping;
}

export default Deliveryman;
