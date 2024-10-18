import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateDentalPracticeDto {
  
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  sapId: string;
}
