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

  @Column({ nullable: true })
  @IsNumber()
  targetId: number;

  @Column({ nullable: true })
  @IsString()
  forVendor: string;

  @Column({ nullable: true })
  @IsString()
  profileImg: string;

  @Column({ nullable: false })
  @IsString()
  @IsIn(["vendor", "product", "deliveryman"])
  to: string;

  @Column({ nullable: true })
  @IsString()
  review: string;

  @Column({ nullable: true })
  @IsNumber()
  rating: number;
}

export default Feedbacks;
