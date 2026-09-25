import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class updateUserPasswordDTO {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsEmail()
  @IsNotEmpty()
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
