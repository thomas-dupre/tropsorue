'use strict';

export class CustomError extends Error {
  constructor(message, statusCode = 400, originalError) {
    super(message);
    this.originalError = originalError;
    this.httpCode = statusCode;
  }
}

/**
 * Format error
 * @param {CustomError | Error} error
 * @returns
 */
export function errorFormatter(error) {
  let statusCode = 404;
  let body = {
    message: 'Internal server error',
  };

  if (error instanceof CustomError) {
    console.log(error);
    statusCode = error.httpCode;
    body.message = error.message;
    body.originalError = error.originalError;

    console.error(error);
  } else {
    console.error({ statusCode, error });
  }

  return { statusCode, body };
}

export function notFoundError(message, originalError) {
  throw new CustomError(message ?? 'Not found', 404, originalError);
}

export function internalError(message, originalError) {
  throw new CustomError(message ?? 'Internal server error', 500, originalError);
}
