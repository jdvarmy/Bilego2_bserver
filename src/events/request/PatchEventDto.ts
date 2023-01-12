import { IsNotEmpty, IsString } from 'class-validator';
import { ReqEvent } from './ReqEvent';

export class PatchEventDto extends ReqEvent {
  @IsNotEmpty()
  @IsString()
  uid: string;
}
