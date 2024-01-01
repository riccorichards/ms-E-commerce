import { IsIn, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class FeedbackValidation {
  @IsString()
  userId: string;

  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  authorImg: string;

  @IsString()
  @IsIn(["vendor", "product", "deliveryman"])
  address: string;

  @IsOptional()
  @IsNumber()
  targetId?: number;

  @IsString()
  targetImg: string;

  @IsString()
  targetTitle: string;

  @IsOptional()
  @IsString()
  forVendorId?: string;

  @IsOptional()
  @IsNumber()
  vendorRating?: number;

  @IsString()
  @Length(3, 150)
  review: string;
}
