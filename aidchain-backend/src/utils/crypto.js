const crypto = require('crypto');
const fs = require('fs');
const { promisify } = require('util');

/**
 * Calculate SHA-256 hash of a file
 * @param {string} filePath - Path to the file
 * @returns {Promise<string>} - Hex string of the hash
 */
async function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);

    stream.on('data', (data) => {
      hash.update(data);
    });

    stream.on('end', () => {
      resolve(hash.digest('hex'));
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Calculate SHA-256 hash of a string
 * @param {string} data - String data to hash
 * @returns {string} - Hex string of the hash
 */
function hashString(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generate a random token
 * @param {number} length - Length of the token in bytes (default 32)
 * @returns {string} - Hex string token
 */
function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Verify file integrity by comparing hashes
 * @param {string} filePath - Path to the file
 * @param {string} expectedHash - Expected hash value
 * @returns {Promise<boolean>} - True if hashes match
 */
async function verifyFileIntegrity(filePath, expectedHash) {
  try {
    const actualHash = await hashFile(filePath);
    return actualHash === expectedHash;
  } catch (err) {
    console.error('Error verifying file integrity:', err);
    return false;
  }
}

module.exports = {
  hashFile,
  hashString,
  generateToken,
  verifyFileIntegrity,
};
