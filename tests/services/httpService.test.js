/* global expect sinon */

'use strict';

import axios from 'axios';

import httpService from '../../src/services/tools/httpService.js';
import { CustomError } from '../../src/utils/errors.js';

const getJsonFromUrl = httpService.getJsonFromUrl;

const CORRECT_URL = 'https://my-awesome-data.com/file.json';
const CORRECT_JSON_URL = 'https://my-awesome-data.com/notajson.txt';
const WRONG_URL = '42';

describe('#httpService', function () {
  let axiosGetSub;
  beforeEach(function () {
    // Mock the axios get function
    axiosGetSub = sinon.stub(axios, 'get');
  });

  afterEach(function () {
    // Restore the mock
    axiosGetSub.restore();
  });

  describe('#getJsonFromUrl', function () {
    it('should fetch data and parse without error', async function () {
      // Given
      axiosGetSub.resolves({ data: { players: [] } });

      // When
      const result = getJsonFromUrl(CORRECT_URL);

      // Then
      expect(axiosGetSub.calledWith(CORRECT_URL)).to.be.true;

      expect(result).to.eventually.be.have.property('players');
    });

    it('should throw an error because of incorrect url', async function () {
      // Given
      axiosGetSub.rejects('Error');

      // When
      const result = getJsonFromUrl(WRONG_URL);

      // Then
      expect(axiosGetSub.calledWith(WRONG_URL)).to.be.false;

      expect(result)
        .to.eventually.be.rejectedWith('Error while fetching or parsing the data')
        .and.be.an.instanceOf(CustomError)
        .and.have.property('httpCode', 500);
    });

    it('should throw an error because of incorrect parsing', async function () {
      // Given
      axiosGetSub.resolves({ data: 'blabla' });

      // When
      const result = getJsonFromUrl(CORRECT_JSON_URL);

      // Then
      expect(axiosGetSub.calledWith(CORRECT_JSON_URL)).to.be.true;

      expect(result)
        .to.eventually.be.rejectedWith('Error while fetching or parsing the data')
        .and.be.an.instanceOf(CustomError)
        .and.have.property('httpCode', 500);
    });
  });
});
