import { IsEmail, IsNumber, IsString, Length } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("shipping")
class Shipping {
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
  @Length(5, 100)
  address: string;

  @Column()
  @IsNumber()
  orderId: number;

  @Column()
  @IsString()
  personName: string;

  @Column()
  @IsString()
  @Length(5, 100)
  payment_method: string;

  @Column()
  @IsString()
  @Length(16)
  debit_card: string;

  @Column()
  @IsString()
  @Length(5, 250)
  note: string;
}

export default Shipping;
