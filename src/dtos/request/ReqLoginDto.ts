import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ReqLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
