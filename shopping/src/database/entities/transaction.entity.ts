import { IsString } from "class-validator";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Invoice from "./invoice.entity";

@Entity("transaction")
class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsString()
  total_amount: string;

  @Column()
  @IsString()
  currence: string;

  @Column()
  @IsString()
  tnx_status: string;

  @OneToOne(() => Invoice, (invoice) => invoice.transaction)
  invoice: Invoice;
}

export default Transaction;
