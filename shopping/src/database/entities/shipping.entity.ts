import { IsDate, IsEmail, IsString, Length } from "class-validator";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Address from "./address.entity";
import Vendor from "./vendor.entity";
import Deliveryman from "./deliveryman.entity";

@Entity("shipping")
class Shipping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsString()
  @Length(5, 200)
  full_name: string;

  @Column({ nullable: true })
  @IsString()
  @Length(5, 200)
  company_name: string;

  @Column()
  @IsEmail()
  @IsString()
  @Length(5, 100)
  email: string;

  @Column()
  @IsString()
  @Length(5, 100)
  payment_method: string;

  @Column()
  @IsString()
  @Length(5, 250)
  mark: string;

  @OneToOne(() => Address, { cascade: true })
  @JoinColumn({
    name: "address_id",
  })
  address: Address;

  @OneToOne(() => Vendor, { cascade: true })
  @JoinColumn({
    name: "vendor_id",
  })
  vendor: Vendor;

  @OneToOne(() => Deliveryman, { cascade: true })
  @JoinColumn({
    name: "deliveryman_id",
  })
  deliveryman: Deliveryman;
}

export default Shipping;
