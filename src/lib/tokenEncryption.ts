/**
 * Token Encryption/Decryption Utilities
 *
 * Handles secure encryption and decryption of GitHub tokens
 * Uses AES-256-GCM encryption with environment-based secret key
 *
 * IMPORTANT: Set GITHUB_TOKEN_ENCRYPTION_KEY in environment variables
 * Generate with: openssl rand -base64 32
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // For GCM
const TAG_LENGTH = 16;
const SALT_LENGTH = 64;

/**
 * Get encryption key from environment
 *
 * SECURITY: No fallback key - requires proper environment configuration
 * This ensures tokens are never encrypted with a weak default key
 *
 * @throws {Error} If GITHUB_TOKEN_ENCRYPTION_KEY is not set or invalid
 * @returns {Buffer} 32-byte encryption key for AES-256-GCM
 */
function getEncryptionKey(): Buffer {
  const key = import.meta.env.GITHUB_TOKEN_ENCRYPTION_KEY || process.env.GITHUB_TOKEN_ENCRYPTION_KEY;

  // CRITICAL: No fallback key - fail fast if not configured
  if (!key) {
    throw new Error(
      'GITHUB_TOKEN_ENCRYPTION_KEY environment variable is required.\n' +
      'Generate a secure 32-byte key with:\n' +
      '  node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"\n' +
      'Then add to .env file:\n' +
      '  GITHUB_TOKEN_ENCRYPTION_KEY=<generated-key>'
    );
  }

  // Convert base64 key to buffer
  let keyBuffer: Buffer;
  try {
    keyBuffer = Buffer.from(key, 'base64');
  } catch (error) {
    throw new Error(
      'GITHUB_TOKEN_ENCRYPTION_KEY must be a valid base64-encoded string.\n' +
      'Generate a new key with:\n' +
      '  node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"'
    );
  }

  // SECURITY: Validate key length (AES-256 requires 32 bytes)
  if (keyBuffer.length !== 32) {
    throw new Error(
      `GITHUB_TOKEN_ENCRYPTION_KEY must be exactly 32 bytes (256 bits).\n` +
      `Current length: ${keyBuffer.length} bytes.\n` +
      `Generate a correct key with:\n` +
      `  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
    );
  }

  return keyBuffer;
}

/**
 * Encrypt a GitHub token
 *
 * @param token - The plaintext GitHub token
 * @returns Encrypted token string (format: iv:encrypted:authTag)
 */
export function encryptToken(token: string): string {
  try {
    const key = getEncryptionKey();
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Format: iv:encrypted:authTag (all in hex)
    return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
  } catch (error) {
    console.error('[Token Encryption] Encryption failed:', error);
    throw new Error('Failed to encrypt token');
  }
}

/**
 * Decrypt a GitHub token
 *
 * @param encryptedToken - The encrypted token string (format: iv:encrypted:authTag)
 * @returns Decrypted plaintext token
 */
export function decryptToken(encryptedToken: string): string {
  try {
    const key = getEncryptionKey();
    const parts = encryptedToken.split(':');

    if (parts.length !== 3) {
      throw new Error('Invalid encrypted token format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const authTag = Buffer.from(parts[2], 'hex');

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('[Token Encryption] Decryption failed:', error);
    throw new Error('Failed to decrypt token');
  }
}

/**
 * Validate that a token can be encrypted and decrypted
 * Used for testing encryption setup
 */
export function validateEncryption(): boolean {
  try {
    const testToken = 'test_token_12345';
    const encrypted = encryptToken(testToken);
    const decrypted = decryptToken(encrypted);
    return decrypted === testToken;
  } catch (error) {
    console.error('[Token Encryption] Validation failed:', error);
    return false;
  }
}
