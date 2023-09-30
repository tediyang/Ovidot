const User = require('../models/user.model');

/**
 * This function populates the user with the data of cycles for
 * the provided searched keyword and returns the user object.
 * @param {String} userId
 * @param {String} key - variable(key) to search
 * @param {String} value - value to search for in the key
 * @returns - the user object with the cycles populated.
 */
exports.populateWithCyclesBy = async (userId, key, value) => {
  return new Promise((resolve, reject) => {
    const search = {};
    search[key] = value;

    User.findById(userId)
      .populate({
        path: '_cycles',
        match: search,
      })
      .exec()
        .then((user) => {
          if (!user) {
            resolve(null);
          }
          resolve(user);
        })
        .catch((err) => {
          reject(err);
        })
  });
};

/**
 * Return a user with the populated cycle data
 * @param {User} userId - Id of a given user
 * @returns - resolves the user found.
 */
exports.populateWithCycles = async (userId) => {
  return new Promise((resolve, reject) => {
    User.findById(userId)
      .populate({
        path: '_cycles'
      })
      .exec()
        .then((user) => {
          if (!user) {
            resolve(null);
          }
          resolve(user);
        })
        .catch((err) => {
          reject(err);
        })
  });
}
