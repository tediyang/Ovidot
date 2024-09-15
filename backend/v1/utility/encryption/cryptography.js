const { compare, genSalt, hash } = require('bcrypt');


/**
 * Defines Encryption class.
 * 
 * @author Eyang, Daniel Eyoh <https://github.com/Tediyang>
 */

class Encryption {

  /**
   * Validates a password against an encrypted password.
   *
   * @param {string} og - The value entered by the user.
   * @param {string} encrypted - The encrypted value to compare against.
   * @return {Promise<boolean>} The result of the comparison, true if the values match, false otherwise.
   */
  async validate_encryption(og, encrypted) {
    try {
      const result = await compare(og, encrypted);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Encrypts a password using bcrypt.
   *
   * @param {string} og - The password to be encrypted.
   * @return {Promise<string>} The hashed password.
   */
  async encrypt(og) {
    try {
      const salt = await genSalt(10);
      const hashedValue = await hash(og, salt);
      return hashedValue;
    } catch (error) {
      throw error;
    }
  }
}


const util = new Encryption();
module.exports = util;
