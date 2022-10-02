'use strict';

import middy from '@middy/core';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import httpEventNormalizer from '@middy/http-event-normalizer';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpResponseSerializer from '@middy/http-response-serializer';

import { errorHandler } from '../middlewares/errorHandler';
import { listAndSortByIdPlayers } from '../services/business/playerService';

/**
 * List & sort players
 * @returns
 */
async function listPlayers() {
  // const data = await listAndSortByIdPlayers(false); to use the local data file

  const data = await listAndSortByIdPlayers();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}

export const handler = middy(listPlayers)
  .use(doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
  .use(errorHandler())
  .use(httpEventNormalizer())
  .use(httpResponseSerializer())
  .use(jsonBodyParser());
