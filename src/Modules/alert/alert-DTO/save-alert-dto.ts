import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class saveAlertDTO {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  title!: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  message!: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  location!: string;

  @IsBoolean()
  read!: boolean;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  time!: string;
}
