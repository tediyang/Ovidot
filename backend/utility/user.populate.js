const User = require('../models/user.model');

/**
 * This function populates the user with the data of cycles for
 * the provided searched keyword and returns the user object.
 * @param {String} userId
 * @param {String} key - variable(key) to search
 * @param {String} value - value to search for in the key
 * @returns - the user object with the cycles populated.
 */
exports.populateWithCycles = async (userId, key, value) => {
  return new Promise((resolve, reject) => {
    const search = {};
    search[key] = value;

    User.findById(userId)
      .populate({
        path: '_cycles',
        match: search,
      })
      .exec((err, user) => {
        if (err) {
          reject(err);
        } else if (!user) {
          resolve(null);
        } else {
          resolve(user);
        }
      });
  });
};
