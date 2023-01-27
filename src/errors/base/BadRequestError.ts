import { BaseError } from './BaseError';
import { ErrorCodeEnum } from '../../enums/ErrorCodeEnum';

export class BadRequestError extends BaseError {
  public readonly status: number = ErrorCodeEnum.BadRequest;
}
