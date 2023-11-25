import { IsDate, IsString } from "class-validator";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Payment from "./payment.entity";

@Entity("transaction")
class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  total_amount: string;

  @Column()
  @IsString()
  currence: string;

  @Column()
  @IsString()
  tnx_status: string;

  @OneToOne(() => Payment, (payment) => payment.transaction)
  payment: Payment;
}

export default Transaction;
