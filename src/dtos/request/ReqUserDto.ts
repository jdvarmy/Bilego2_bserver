import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserEntityRole } from '../../types/enums';

export class ReqUserDto {
  @IsNotEmpty({ message: 'Email должен быть заполнен' })
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty({ message: 'Не заполнен статус, хорошо бы заполнить' })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  status?: number;

  @IsOptional()
  @IsString()
  role?: UserEntityRole;

  @IsOptional()
  @IsBoolean()
  sendMail?: boolean;

  @IsOptional()
  @IsNumber()
  avatar?: number;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsDateString()
  birthdate?: Date;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  concertManagerInfo?: string;

  @IsOptional()
  @IsNumber()
  concertManagerPercentage?: number;
}
