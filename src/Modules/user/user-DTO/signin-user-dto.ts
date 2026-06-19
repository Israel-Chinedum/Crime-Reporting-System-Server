import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class signinUserDTO {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  username!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
