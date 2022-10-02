'use strict';

import { listAndSortByIdPlayers } from '../services/business/playerService.js';
import { errorFormatter } from '../utils/errors.js';

/**
 * List players
 * @returns
 */
export function listPlayers(withNetwork = true) {
  return async (_req, res) => {
    try {
      const players = await listAndSortByIdPlayers(withNetwork);

      return res.json(players);
    } catch (err) {
      const { statusCode, body } = errorFormatter(err);
      res.status(statusCode).json(body);
    }
  };
}
