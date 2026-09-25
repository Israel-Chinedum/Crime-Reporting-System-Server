import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class WeeklyReportsDTO {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startOfWeek!: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endOfWeek!: Date;
}
