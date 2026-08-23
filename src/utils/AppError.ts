export class AppError extends Error {
  public statusCode: number;
  public errorDetails: string | object;

  constructor(
    statusCode: number,
    message: string,
    errorDetails?: string | object,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorDetails = errorDetails ?? message;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
