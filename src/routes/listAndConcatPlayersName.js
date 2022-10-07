import { listAndConcatPlayersName } from '../services/business/playerService.js';
import { errorFormatter } from '../utils/errors.js';

/**
 * List players
 * @returns
 */
export function listPlayersName(withNetwork = true) {
  return async (_req, res) => {
    try {
      const players = await listAndConcatPlayersName(withNetwork);

      return res.json(players);
    } catch (err) {
      const { statusCode, body } = errorFormatter(err);
      res.status(statusCode).json(body);
    }
  };
}
