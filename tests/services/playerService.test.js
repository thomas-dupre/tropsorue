/* global sinon */

'use strict';

import { expect } from 'chai';

import { config } from '../../src/config/config.js';
import {
  listPlayersFromSource,
  listAndSortByIdPlayers,
  fetchPlayerById,
  listAndConcatPlayersName,
} from '../../src/services/business/playerService.js';
import httpService from '../../src/services/tools/httpService.js';
import { CustomError } from '../../src/utils/errors.js';

const jsonData = {
  players: [
    { id: 23, firstname: 'Novack', lastname: 'Jack', shortname: 'N.JA' },
    { id: 56, firstname: 'Tony', lastname: 'Jack', shortname: 'T.JA' },
    { id: 1, firstname: 'Cyril', lastname: 'Jack', shortname: 'C.JA' },
  ],
};

const jsonSortedData = [
  { id: 1, firstname: 'Cyril' },
  { id: 23, firstname: 'Novack' },
  { id: 56, firstname: 'Tony' },
];
const jsonPlayersName = ['Novak Jack', 'Tony Jack', 'Cyril Jack'];

const jsonSortedShortnameData = [
  { id: 1, firstname: 'Cyril', shortname: 'C.JA' },
  { id: 23, firstname: 'Novack', shortname: 'N.JA' },
  { id: 56, firstname: 'Tony', shortname: 'T.JA' },
];

const DATA_URL = config.DATA_URL;

const dataError = new CustomError('Error while fetching or parsing the data', 500);

describe('#playerService', function () {
  let getJsonFromUrlStub;

  beforeEach(function () {
    // Mock the tools services
    getJsonFromUrlStub = sinon.stub(httpService, 'getJsonFromUrl');
  });

  afterEach(function () {
    // Restore the mocks
    getJsonFromUrlStub.restore();
  });

  // Testing shared function list players from source with mock of getJsonFromUrl & readAndParseFileAsync
  describe('#listPlayersFromSource', function () {
    it('should list the players from the network', async function () {
      // Given
      getJsonFromUrlStub.resolves(jsonData);

      // When
      const result = listPlayersFromSource(true);

      // Then
      expect(getJsonFromUrlStub.calledWith(DATA_URL)).to.be.true;

      expect(result).to.eventually.be.equal(jsonData.players);
    });

    it('should list the players from the file', async function () {
      // When
      const result = listPlayersFromSource(false);

      // Then
      expect(result).to.eventually.be.equal(jsonData.players);
    });

    it('should throw a 500 because of network issue', async function () {
      // Given
      getJsonFromUrlStub.rejects(dataError);

      // When
      const result = listPlayersFromSource(true);

      // Then
      expect(getJsonFromUrlStub.calledWith(DATA_URL)).to.be.true;

      expect(result)
        .to.eventually.be.rejectedWith('Error while fetching or parsing the data')
        .and.be.an.instanceOf(CustomError)
        .and.have.property('httpCode', 500);
    });

    it('should throw a 500 because of file issue', async function () {
      // When
      const result = listPlayersFromSource(false);

      // Then
      expect(result)
        .to.eventually.be.rejectedWith('Error while fetching or parsing the data')
        .and.be.an.instanceOf(CustomError)
        .and.have.property('httpCode', 500);
    });
  });

  // Testing listAndSortByIdPlayers function
  describe('#listAndSortByIdPlayers [FROM NETWORK]', function () {
    it('should list & sort players by id', async function () {
      // Given
      getJsonFromUrlStub.resolves(jsonData);

      // When
      const result = listAndSortByIdPlayers();

      // Then
      expect(getJsonFromUrlStub.calledWith(DATA_URL)).to.be.true;
      expect(result).to.eventually.be.equal(jsonSortedData);
      console.log(await result);
      expect((await result)[0].firstname).to.be.equal('Cyril');
    });

    it('should list & sort players by shortname', async function () {
      // Given
      getJsonFromUrlStub.resolves(jsonData);

      // When
      const result = listAndSortByIdPlayers(true, 'shortname');

      // Then
      expect(getJsonFromUrlStub.calledWith(DATA_URL)).to.be.true;
      expect(result).to.eventually.be.equal(jsonSortedShortnameData);
      // expect((await result)[0].shortname).to.be.equal('C.JA');
    });

    it('should throw a bad request error cause of wrong sort key', async function () {
      // Given
      getJsonFromUrlStub.resolves(jsonData);

      // When
      const result = listAndSortByIdPlayers(true, 'erere');

      // Then
      // expect(getJsonFromUrlStub.calledWith(DATA_URL)).to.be.false;

      expect(result)
        .to.eventually.be.rejectedWith('Key is not valid')
        .and.be.an.instanceOf(CustomError)
        .and.have.property('httpCode', 400);
    });
  });

  // Testing fetchPlayerById function
  describe('#fetchPlayerById [FROM NETWORK]', function () {
    it('should find the player by id', async function () {
      // Given
      getJsonFromUrlStub.resolves(jsonData);

      // When
      const result = fetchPlayerById(56);

      // Then
      expect(getJsonFromUrlStub.calledWith(DATA_URL)).to.be.true;
      expect(result).to.eventually.be.equal(jsonData.players[1]);
      expect((await result).firstname).to.be.equal('Tony');
    });

    it('should throw a 404 because the player id is not a integer', async function () {
      // Given
      getJsonFromUrlStub.resolves(jsonData);

      // When
      const result = fetchPlayerById('89');

      // Then
      expect(getJsonFromUrlStub.calledWith(DATA_URL)).to.be.false;

      expect(result)
        .to.eventually.be.rejectedWith('Not found')
        .and.be.an.instanceOf(CustomError)
        .and.have.property('httpCode', 404);
    });

    it('should throw a 404 because the player was not found', async function () {
      // Given
      getJsonFromUrlStub.resolves(jsonData);

      // When
      const result = fetchPlayerById(89);

      // Then
      expect(getJsonFromUrlStub.calledWith(DATA_URL)).to.be.true;

      expect(result)
        .to.eventually.be.rejectedWith('Not found')
        .and.be.an.instanceOf(CustomError)
        .and.have.property('httpCode', 404);
    });
  });

  // Testing listAndConcatPlayersName function
  describe('#listAndConcatPlayersName [FROM NETWORK]', function () {
    it('should list the players and concat their first & last names', async function () {
      // Given
      getJsonFromUrlStub.resolves(jsonData);

      // When
      const result = listAndConcatPlayersName(true);

      // Then
      expect(getJsonFromUrlStub.calledWith(DATA_URL)).to.be.true;

      expect(result).to.eventually.be.equal(jsonPlayersName);
    });
  });
});
