import { fetchPlayerById } from '../services/business/playerService.js';
import { errorFormatter } from '../utils/errors.js';

/**
 * Get Player by id
 * @param {*} express event
 */
export async function getPlayerById(req, res) {
  const playerId = req.params.playerId;

  try {
    const player = await fetchPlayerById(+playerId);
    return res.json(player);
  } catch (error) {
    const { statusCode, body } = errorFormatter(error);
    res.status(statusCode).json(body);
  }
}
