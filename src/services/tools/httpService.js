'use strict';

import axios from 'axios';

import { internalError } from '../../utils/errors.js';
import { isDef } from '../../utils/isDef.js';

/**
 * Get JSON data from URL
 * @param {string} url
 * @returns json data
 */
async function getJsonFromUrl(url) {
  try {
    const res = await axios.get(new URL(url).toString());
    if (!isDef(res) || !isDef(res.data)) {
      throw new Error('Undefined data');
    }

    if (typeof res.data === 'string') {
      return JSON.parse(res.data);
    }
    return res.data;
  } catch (err) {
    internalError('Error while fetching or parsing the data', err);
  }
}

// Only possible to stub/mock an object with ES Modules
export default {
  getJsonFromUrl,
};
