import { IsNotEmpty, IsString } from 'class-validator';

export class ReqEventDto {
  @IsNotEmpty()
  @IsString()
  uid: string;

  @IsNotEmpty()
  @IsString()
  slug: string;
}
