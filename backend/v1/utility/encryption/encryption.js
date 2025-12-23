const crypto = require('crypto');
const { logger } = require('../../middleware/logger.js');

/**
 * ----------------------------------
 * KEY MANAGEMENT & VERSION CONTROL
 * ----------------------------------
 */
const RAW_KEYS = {
  v1: {
    key: process.env.ENCRYPTION_KEY_V1,
    salt: process.env.ENCRYPTION_SALT_V1,
  },
  v2: {
    key: process.env.ENCRYPTION_KEY_V2,
    salt: process.env.ENCRYPTION_SALT_V2,
  }
};

const CURRENT_VERSION = 'v1';

/**
 * ----------------------------------
 * ALGORITHM SETTINGS
 * ----------------------------------
 */
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

/**
 * ----------------------------------
 * KEY DERIVATION
 * ----------------------------------
 */
const DERIVED_KEYS = {};
Object.keys(RAW_KEYS).forEach((version) => {
  DERIVED_KEYS[version] = crypto.pbkdf2Sync(
    RAW_KEYS[version].key,
    RAW_KEYS[version].salt,
    100000,
    32,
    'sha256'
  );
});

/**
 * -----------------------------------------------------------
 * ENCRYPT TEXT
 * -----------------------------------------------------------
 */
const encryptText = (text) => {
  if (typeof text !== 'string' || !text) return '';

  const key = DERIVED_KEYS[CURRENT_VERSION];
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encryptedBuffer = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final()
  ]);

  const authTag = cipher.getAuthTag();

  return `${CURRENT_VERSION}:${iv.toString('base64')}:${authTag.toString('base64')}:${encryptedBuffer.toString('base64')}`;
};

/**
 * -----------------------------------------------------------
 * DECRYPT TEXT
 * -----------------------------------------------------------
 */
const decryptText = (encryptedString, context = {}) => {
  if (!encryptedString || typeof encryptedString !== 'string') return '';

  try {
    const parts = encryptedString.split(':');

    if (parts.length !== 4) {
      throw new Error('Invalid encrypted string format');
    }

    const [version, ivBase64, tagBase64, dataBase64] = parts;

    const key = DERIVED_KEYS[version];
    if (!key) throw new Error(`Unknown encryption key version: ${version}`);

    const iv = Buffer.from(ivBase64, 'base64');
    const authTag = Buffer.from(tagBase64, 'base64');
    const encrypted = Buffer.from(dataBase64, 'base64');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);

    return decrypted.toString('utf8');

  } catch (err) {
    logger.error('Decryption failed', { error: err.message, context });
    return '';
  }
};

module.exports = {
  encryptText,
  decryptText
};
