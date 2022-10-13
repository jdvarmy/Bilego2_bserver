import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ReqRegisterDto {
  @IsNotEmpty({ message: 'Email должен быть заполнен' })
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name: string;
}
