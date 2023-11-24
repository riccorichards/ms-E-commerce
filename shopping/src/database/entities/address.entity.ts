import { IsString, Length } from "class-validator";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Shipping from "./shipping.entity";

@Entity("address")
class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @Length(3, 200)
  street: string;

  @Column()
  @IsString()
  @Length(3, 50)
  city: string;

  @Column()
  @IsString()
  @Length(3, 50)
  state: string;

  @Column()
  @IsString()
  @Length(3, 10)
  zip_code: string;

  @Column()
  @IsString()
  @Length(3, 50)
  country: string;

  @OneToOne(() => Shipping, (shipping) => shipping.address)
  shipping: Shipping;
}

export default Address;
