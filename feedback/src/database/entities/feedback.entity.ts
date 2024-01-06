import { IsIn, IsNumber, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("feedbacks")
class Feedbacks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @IsString()
  userId: string;

  @Column({ nullable: false })
  @IsString()
  author: string;

  @Column({ nullable: false })
  @IsString()
  authorImg: string;

  @Column({ nullable: true })
  @IsNumber()
  targetId: number;

  @Column({ nullable: true })
  @IsString()
  forVendorId: string;

  @Column({ nullable: true })
  @IsString()
  targetImg: string;

  @Column()
  @IsString()
  targetTitle: string;

  @Column({ nullable: false })
  @IsString()
  @IsIn(["vendor", "product", "deliveryman"])
  address: string;

  @Column({ nullable: true })
  @IsString()
  review: string;

  @Column({ type: "float", nullable: true })
  @IsNumber()
  vendorRating: number;
}

export default Feedbacks;
