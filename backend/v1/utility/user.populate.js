import { findById } from '../models/user.model';

/**
 * Populate the user with the data of cycles for the provided searched keyword and return the user object.
 *
 * @param {String} userId - The ID of the user to populate.
 * @param {String} key - The variable (key) to search.
 * @param {String} value - The value to search for in the key.
 * @returns {Promise<User|null>} - A promise that resolves to the user object with the cycles populated or null if not found.
 */
export async function populateWithCyclesBy(userId, key, value) {
  /**
   * The search criteria to find cycles.
   * @type {Object.<string, string>}
   */
  const search = {};
  search[key] = value;

  try {
    /**
     * The user object with populated cycle data.
     * @type {User|null}
     */
    const user = await findById(userId).populate({
      path: '_cycles',
      match: search,
    }).exec();

    return user || null;
  } catch (err) {
    throw err;
  }
}

/**
 * Return a user with the populated cycle data.
 *
 * @param {String} userId - The ID of the user to populate.
 * @returns {Promise<User|null>} - A promise that resolves to the user object with the cycles populated or null if not found.
 */
export async function populateWithCycles(userId) {
  try {
    /**
     * The user object with populated cycle data.
     * @type {User|null}
     */
    const user = await findById(userId).populate({
      path: '_cycles',
    }).exec();

    return user || null;
  } catch (err) {
    throw err;
  }
}
