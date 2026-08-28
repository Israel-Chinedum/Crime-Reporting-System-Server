import { IsNotEmpty, IsString } from 'class-validator';

export class adminSigninDTO {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
