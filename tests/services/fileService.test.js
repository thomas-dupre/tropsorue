/* global expect sinon */
'use strict';

import fs from 'fs';

import { readAndParseFileAsync } from '../../src/services/tools/fileService.js';
import { CustomError } from '../../src/utils/errors.js';

describe('#fileService', function () {
  let fsReadFileStub;
  beforeEach(function () {
    // Mock the fs promises readFile function
    fsReadFileStub = sinon.stub(fs.promises, 'readFile');
  });

  afterEach(function () {
    // Restore the mock
    fsReadFileStub.restore();
  });

  describe('#readAndParseFileAsync', function () {
    it('should read and parse without error', async function () {
      // Given
      fsReadFileStub.resolves(JSON.stringify({ players: [] }));

      // When
      const result = readAndParseFileAsync('rightfile.json');

      // Then
      expect(fsReadFileStub.calledWith(`rightfile.json`)).to.be.true;

      expect(result).to.eventually.have.property('players');
    });

    it('should throw an error because of incorrect pathname', async function () {
      // Given
      fsReadFileStub.rejects('Error');

      // When
      const result = readAndParseFileAsync('ee');

      // Then
      expect(fsReadFileStub.calledWith('ee')).to.be.true;

      expect(result)
        .to.eventually.be.rejectedWith('Error while reading or parsing the file')
        .and.be.an.instanceOf(CustomError)
        .and.have.property('httpCode', 500);
    });

    it('should throw an error because of incorrect parsing', async function () {
      // Given
      fsReadFileStub.resolves('ee');

      // When
      const result = readAndParseFileAsync('fakefile.json');

      // Then
      expect(fsReadFileStub.calledWith(`fakefile.json`)).to.be.true;

      expect(result)
        .to.eventually.be.rejectedWith('Error while reading or parsing the file')
        .and.be.an.instanceOf(CustomError)
        .and.have.property('httpCode', 500);
    });
  });
});
