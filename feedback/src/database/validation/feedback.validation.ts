import { IsNumber, IsString, Length } from "class-validator";

export class FeedbackValidation {
  @IsString()
  userId: string;

  @IsString()
  author: string;

  @IsString()
  profileImg: string;

  @IsString()
  to: string;

  @IsNumber()
  targetId: number;

  @IsNumber()
  @IsString()
  forVendor: string;

  @IsString()
  @Length(3, 300)
  review: string;

  @IsNumber()
  rating: number;
}
