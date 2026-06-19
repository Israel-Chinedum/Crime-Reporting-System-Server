import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class updateUserPasswordDTO {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(6)
  @MinLength(6)
  otp!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
