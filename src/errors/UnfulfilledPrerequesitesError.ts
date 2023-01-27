import { UnprocessableEntityError } from './base/UnprocessableEntityError';
import { ErrorMessageEnum } from '../enums/ErrorMessageEnum';

export class UnfulfilledPrerequesitesError extends UnprocessableEntityError {
  public constructor() {
    super();
    this.setError(ErrorMessageEnum.UnfulfilledPrerequisite)
  }
}