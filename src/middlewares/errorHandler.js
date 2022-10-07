'use strict';

import { errorFormatter } from '../utils/errors';

/**
 * Catch the errors & tranform them with a status code & body
 * @returns
 */
export function errorHandler() {
  return {
    onError: handler => {
      const error = handler.error;

      const { statusCode, body } = errorFormatter(error);

      handler.response = {
        statusCode,
        body: JSON.stringify(body),
      };

      return Promise.resolve();
    },
  };
}
