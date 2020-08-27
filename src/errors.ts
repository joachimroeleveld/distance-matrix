/**
 * These definitions are quite verbose but it seems the only way to have them
 * be properly identifiable and formatted.
 */

export class MatrixFormatError extends Error {
  constructor(message: string) { super(message);
    Object.setPrototypeOf(this, MatrixFormatError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ParseError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidArgumentError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidArgumentError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
