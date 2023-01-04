import { ReqEvent } from './ReqEvent';
import { IsNotEmpty, IsString } from 'class-validator';

export class PatchEventDto extends ReqEvent {
  @IsNotEmpty()
  @IsString()
  uid: string;
}
