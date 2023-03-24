import { HttpExceptionResponse } from '../filters/all-exceptions.filter';

export function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

export function isHttpExceptionResponse(
  value: unknown,
): value is HttpExceptionResponse {
  if (!isObject(value)) {
    return false;
  }

  return (
    'statusCode' in value &&
    typeof value.statusCode === 'number' &&
    'error' in value &&
    typeof value.error === 'string' &&
    'message' in value &&
    (typeof value.message === 'string' || typeof value.message === 'number')
  );
}
