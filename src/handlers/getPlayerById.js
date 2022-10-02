'use strict';

import middy from '@middy/core';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import httpEventNormalizer from '@middy/http-event-normalizer';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpResponseSerializer from '@middy/http-response-serializer';

import { errorHandler } from '../middlewares/errorHandler';
import { fetchPlayerById } from '../services/business/playerService';

/**
 * Get Player by id
 * @param {*} event aws event
 * @returns
 */
async function getPlayerById(event) {
  const playerId = event.pathParameters.playerId;

  const player = await fetchPlayerById(+playerId);

  return {
    statusCode: 200,
    body: JSON.stringify(player),
  };
}

export const handler = middy(getPlayerById)
  .use(doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
  .use(errorHandler())
  .use(httpEventNormalizer())
  .use(httpResponseSerializer())
  .use(jsonBodyParser());
