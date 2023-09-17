import { CityShort } from '../types/enums';
import { isCityShortEnum } from '../types/tsGuards';
import { InternalServerErrorException } from '@nestjs/common';

export function getLongCity(city: string): keyof typeof CityShort | null {
  if (!isCityShortEnum(city)) {
    return null;
  }

  const longCity = Object.entries(CityShort).find(
    (shortCity) => shortCity[1] === city,
  )[0] as keyof typeof CityShort;

  if (!longCity) {
    throw new InternalServerErrorException('No city');
  }

  return longCity;
}
