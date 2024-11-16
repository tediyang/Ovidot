const { readFileSync, writeFileSync } = require('fs');
require('dotenv').config();


class BlackList {
  /**
   * Initializes the BlackList instance.
   *
   * @constructor
   */
  constructor() {
    this._blacklist = process.env.BLACKLIST;
  };

  /**
   * Fuction that reads the blacklist json file
   * @returns - An array of tokens or an empty list.
   * 
   */
  readBlacklist() {
    try {
      const data = readFileSync(this._blacklist, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }
  
  /**
   * blacklist a token
   * @param {String} token - User token
   */
  updateBlacklist(token) {
    const blacklistData = this.readBlacklist();
    blacklistData.push(token);
  
    // Write the updated blacklist array back to the file
    writeFileSync(this._blacklist, JSON.stringify(blacklistData));
  }
  
  /**
   * Checks if a token is blacklisted
   * @param {String} token - the user token for authorization 
   * @returns - True - if the token is blacklisted and False - if it isn't.
   */
  isTokenBlacklisted(token) {
    const blacklistData = this.readBlacklist();
    return blacklistData.includes(token);
  }
};


const blacklist = new BlackList()
module.exports = blacklist;
