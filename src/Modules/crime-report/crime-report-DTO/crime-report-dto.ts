import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class crimeReportDTO {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  incident_type!: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  location!: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description!: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  time!: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  date!: string;

  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  evidence_provided!: boolean;
}
