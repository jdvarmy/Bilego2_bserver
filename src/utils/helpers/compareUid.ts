import { InternalServerErrorException } from '@nestjs/common';
import { Exception500 } from '../types/enums';

export function compareUid(uid1, uid2): boolean {
  if (uid1 !== uid2) {
    throw new InternalServerErrorException(Exception500.uid);
  }

  return true;
}
