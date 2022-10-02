'use strict';

import { config } from '../../config/config.js';
import players from '../../data/players.json';
import { notFoundError } from '../../utils/errors.js';
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
export const listAndSortByIdPlayers = async (withNetwork = true) => {
  const players = await listPlayersFromSource(withNetwork);

  return players.sort((a, b) => a.id - b.id);
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
