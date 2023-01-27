import { ErrorCodeEnum } from '../../enums/ErrorCodeEnum';
import { BaseError } from './BaseError';

export class UnprocessableEntityError extends BaseError {
  public readonly status: number = ErrorCodeEnum.UnprocessableEntity;
}
