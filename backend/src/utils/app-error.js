export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    // this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.status = statusCode >= 400 && statusCode < 500 ?  'fail' : 'error';
    this.isOperational = true;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    
  }
}
