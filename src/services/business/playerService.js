'use strict';

import { config } from '../../config/config.js';
import players from '../../data/players.json';
import { notFoundError, badRequestError } from '../../utils/errors.js';
import { playerNameFormatter } from '../../utils/formatter.js';
import httpService from '../tools/httpService.js';

// import.meta.url (es6) does not work when bundled
// need the --experimental-json-modules option with express

/**
 * List of players from a source
 * @param {boolean} withNetwork
 * @returns
 */
export const listPlayersFromSource = async (withNetwork = true) => {
  const data = withNetwork ? await httpService.getJsonFromUrl(config.DATA_URL) : players;
  return data.players;
};

/**
 * List and sort players by id
 * @param {boolean} withNetwork use the url if true
 * @returns a list of players
 */
export const listAndSortByIdPlayers = async (withNetwork = true, key = 'id') => {
  if (!['id', 'firstname', 'lastname', 'shortname'].includes(key)) {
    badRequestError('Key is not valid');
  }

  const players = await listPlayersFromSource(withNetwork);
  // console.log(key, ['id', 'firstname', 'lastname', 'shortname'].includes(key));

  return players.sort((a, b) => (key === 'id' ? a.id - b.id : a[key].localeCompare(b[key])));
};

/**
 * Get one player by id
 * @param {number} playerId id to find
 * @param {boolean} withNetwork use the url if true
 * @returns a specific player
 */
export const fetchPlayerById = async (playerId, withNetwork = true) => {
  if (!Number.isInteger(playerId)) {
    notFoundError();
  }

  const players = await listPlayersFromSource(withNetwork);

  const player = players.find(ply => ply.id === playerId);
  if (!player) {
    notFoundError();
  }

  return player;
};

/**
 * List & concat players name
 * @param {boolean} withNetwork use the url if true
 * @returns a list of players
 */
export const listAndConcatPlayersName = async (withNetwork = true) => {
  const players = await listPlayersFromSource(withNetwork);

  return players.map(player => playerNameFormatter(player.firstname, player.lastname));
};
