import { IsNotEmpty, IsString } from 'class-validator';

export class PutEventDto {
  @IsNotEmpty()
  @IsString()
  uid: string;

  @IsNotEmpty()
  @IsString()
  slug: string;
}
