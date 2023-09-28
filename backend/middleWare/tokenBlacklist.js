const fs = require('fs');
const blacklist = 'blacklist.json';

/**
 * Fuction that reads the blacklist json file
 * @returns - An array of tokens or an empty list.
 * 
 */
function readBlacklist() {
  try {
    const data = fs.readFileSync(blacklist, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

/**
 * Updated a token to the blacklist
 * @param {String} token - User token
 */
exports.updateBlacklist = (token) => {
  const blacklistData = readBlacklist();
  console.log(blacklistData);
  blacklistData.push(token);

  // Write the updated blacklist array back to the file
  fs.writeFileSync(blacklist, JSON.stringify(blacklistData));
}

/**
 * Checks if a token is blacklisted
 * @param {String} token - the user token for authorization 
 * @returns - True - if the token is blacklisted and False - if it isn't.
 */
exports.isTokenBlacklisted = (token) => {
  const blacklistData = readBlacklist();
  return blacklistData.includes(token);
}
