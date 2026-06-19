import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class createUserDTO {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  fullname!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim().toLowerCase())
  department!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim().toLowerCase())
  Matric_Number!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @Matches(/^\d{11}$/, { message: 'Phone number is not valid!' })
  Phone_Number!: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  username!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  password!: string;
}
