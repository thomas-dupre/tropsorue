'use strict';

import { listAndSortByIdPlayers } from '../services/business/playerService.js';
import { errorFormatter } from '../utils/errors.js';

/**
 * List players
 * @returns
 */
export function listPlayers(withNetwork = true) {
  return async (req, res) => {
    try {
      // console.log(Object.keys(req));
      const sortKey = req.query.sortBy;
      const players = await listAndSortByIdPlayers(withNetwork, sortKey ?? 'id');

      return res.json(players);
    } catch (err) {
      const { statusCode, body } = errorFormatter(err);
      res.status(statusCode).json(body);
    }
  };
}
