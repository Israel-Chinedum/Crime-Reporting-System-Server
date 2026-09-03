import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAdminPasswordDTO {
  @IsNotEmpty()
  @IsString()
  currentPassword!: string;

  @IsNotEmpty()
  @IsString()
  newPassword!: string;
}
