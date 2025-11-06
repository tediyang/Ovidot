const crypto = require('crypto');
const pino = require('pino');

const logger = pino({ level: 'error' });

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

/**
 * Derive a 32-byte key using PBKDF2.
 * NOTE: Use environment variables for ENCRYPTION_KEY and ENCRYPTION_SALT in production.
 */
const SECRET_KEY = crypto.pbkdf2Sync(
  process.env.ENCRYPTION_KEY ||
    'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
  process.env.ENCRYPTION_SALT || 'salt',
  100000,
  32,
  'sha256'
);

/**
 * Encrypt text safely using AES-256-CBC.
 * @param {string} text - Plain text to encrypt.
 * @returns {string} Base64 encoded encrypted string.
 */
const encryptText = (text) => {
  if (typeof text !== 'string' || !text) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return Buffer.concat([iv, Buffer.from(encrypted, 'base64')]).toString('base64');
};

/**
 * Decrypt text safely.
 * @param {string} encryptedText - Base64 encoded encrypted text.
 * @param {object} [context={}] - Optional context for logging errors.
 * @returns {string} Decrypted plain text or empty string on failure.
 */
const decryptText = (encryptedText, context = {}) => {
  if (!encryptedText || typeof encryptedText !== 'string') return '';
  try {
    const buffer = Buffer.from(encryptedText, 'base64');
    if (buffer.length < IV_LENGTH) throw new Error('Invalid encrypted data');

    const iv = buffer.subarray(0, IV_LENGTH);
    const encrypted = buffer.subarray(IV_LENGTH).toString('base64');
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    logger.error('Decryption failed', { error: err.message, context });
    return '';
  }
};

module.exports = {
  encryptText,
  decryptText,
};
