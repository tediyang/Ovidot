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

  /**
   * Generate Password with a mix of uppercase, lowercase, digits, and special characters.
   *
   * @param {string} length - The length of the password to generate. Default 12 characters.
   * @return {Promise<string>} The generated password.
   */
  generatePassword(length = 12) {
    // Ensure the minimum length requirement is met
    if (length < 8) {
        length = 8;
    }

    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Guarantee at least one of each required type
    const passwordChars = [
      uppercase[Math.floor(Math.random() * uppercase.length)],
      digits[Math.floor(Math.random() * digits.length)],
      special[Math.floor(Math.random() * special.length)]
    ];

    // Fill the rest of the password length with a mix of all available characters
    const allCharacters = lowercase + uppercase + digits + special;
    for (let i = passwordChars.length; i < length; i++) {
      passwordChars.push(allCharacters[Math.floor(Math.random() * allCharacters.length)]);
    }

    // Shuffle the array to ensure randomness in character positions
    for (let i = passwordChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
    }

    // Join array into a final string
    return passwordChars.join('');
  }
}


const util = new Encryption();
module.exports = util;
