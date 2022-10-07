'use strict';

import express from 'express';

import { getPlayerById } from './routes/getPlayerById.js';
import { listPlayersName } from './routes/listAndConcatPlayersName.js';
import { listPlayers } from './routes/listPlayers.js';

const { PORT = 3000 } = process.env;

const app = express();

app.get('/players', listPlayers());

// Endpoint with the local json file
// //app.get('/players', listPlayers(false));

app.get('/players/:playerId', getPlayerById);

app.get('/players-name', listPlayersName());

app.listen(PORT, () => {
  console.log(`Server ready & listening on port ${PORT}`);
});
