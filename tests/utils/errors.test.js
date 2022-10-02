/* global expect */
'use strict';

import {
  CustomError,
  errorFormatter,
  internalError,
  notFoundError,
} from '../../src/utils/errors.js';

describe('#errors', function () {
  it('should throw a 404 error & not found message', async function () {
    // When
    const result = (async () => {
      notFoundError();
    })();

    // Then
    expect(result)
      .to.eventually.be.rejectedWith('Not found')
      .and.be.an.instanceOf(CustomError)
      .and.have.property('httpCode', 404);
  });

  it('should throw a 500 error & internal server error message', async function () {
    // When
    const result = (async () => {
      internalError();
    })();

    // Then
    return expect(result)
      .to.eventually.be.rejectedWith('Internal server error')
      .and.be.an.instanceOf(CustomError)
      .and.have.property('httpCode', 500);
  });

  it('should return a error body', async function () {
    // When
    const result = errorFormatter(new CustomError('Bad Request', 400));

    // Then
    return expect(result).to.have.property('statusCode', 400);
  });
});
