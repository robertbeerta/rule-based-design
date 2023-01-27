import { ErrorCodeEnum } from '../../enums/ErrorCodeEnum';
import { BaseError } from './BaseError';

export class NotFoundError extends BaseError {
  public readonly status: number = ErrorCodeEnum.NotFound;
}
