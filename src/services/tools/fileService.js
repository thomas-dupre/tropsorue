'use strict';

import fs from 'fs/promises';

import { internalError } from '../../utils/errors.js';

/**
 * Path of the local file
 * @param {string} pathname
 * @returns json data
 */
export async function readAndParseFileAsync(pathname) {
  try {
    const data = await fs.readFile(pathname);
    return JSON.parse(data.toString());
  } catch (err) {
    throw internalError('Error while reading or parsing the file', err);
  }
}
