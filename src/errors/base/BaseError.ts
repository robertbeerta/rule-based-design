export class BaseError extends Error {
  protected setError(errorMessage: string, ...values: string[]): void {
    this.message = errorMessage;

    for (let index = 0; index < values.length; index++) {
      this.message = this.message.replace(`{${index}}`, values[index]);
    }
  }
}
