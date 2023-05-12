type ClassConstructor<T> = {
  new (...args: any[]): T;
};

export function plainToClassResponse<C, T>(
  cls: ClassConstructor<C>,
  plain: T[],
  short?: boolean,
): C[];
export function plainToClassResponse<C, T>(
  cls: ClassConstructor<C>,
  plain: T,
  short?: boolean,
): C;

export function plainToClassResponse(cls, plain, short) {
  if (Array.isArray(plain)) {
    return plain.map((pl) => Object.assign({}, new cls(pl, short)));
  }

  return Object.assign({}, new cls(plain));
}
