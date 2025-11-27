/**
 * AES-256 Encryption Service for MindLens
 * HIPAA-compliant encryption for sensitive patient data
 */

import { encodeBase64, decodeBase64 } from 'jsr:@std/encoding@1/base64';

// Encryption configuration
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits for AES-GCM

/**
 * Generate or retrieve encryption key from environment
 * In production, this should be stored in Google Cloud Secret Manager
 */
function getEncryptionKey(): Uint8Array {
  const keyEnv = Deno.env.get('ENCRYPTION_KEY_BASE64');
  
  if (keyEnv) {
    try {
      return decodeBase64(keyEnv);
    } catch (error) {
      console.error('Invalid ENCRYPTION_KEY_BASE64, generating new key');
    }
  }
  
  // Generate a new key (for development only)
  // WARNING: In production, use a persistent key from Secret Manager
  const key = globalThis.crypto.getRandomValues(new Uint8Array(32)); // 256 bits
  console.warn('⚠️  Using ephemeral encryption key. Set ENCRYPTION_KEY_BASE64 for production.');
  console.log('Generated key (base64):', encodeBase64(key));
  return key;
}

const ENCRYPTION_KEY = getEncryptionKey();

/**
 * Encrypt sensitive data using AES-256-GCM
 * Returns base64-encoded encrypted data with IV prepended
 */
export async function encrypt(data: any): Promise<string> {
  try {
    // Convert data to JSON string
    const plaintext = JSON.stringify(data);
    const plaintextBytes = new TextEncoder().encode(plaintext);
    
    // Generate random IV (Initialization Vector)
    const iv = globalThis.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    
    // Import key for Web Crypto API
    const key = await globalThis.crypto.subtle.importKey(
      'raw',
      ENCRYPTION_KEY,
      { name: ALGORITHM, length: KEY_LENGTH },
      false,
      ['encrypt']
    );
    
    // Encrypt the data
    const encryptedBytes = await globalThis.crypto.subtle.encrypt(
      { name: ALGORITHM, iv },
      key,
      plaintextBytes
    );
    
    // Combine IV + encrypted data
    const combined = new Uint8Array(iv.length + encryptedBytes.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBytes), iv.length);
    
    // Return as base64
    return encodeBase64(combined);
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt AES-256-GCM encrypted data
 * Accepts base64-encoded data with IV prepended
 */
export async function decrypt(encryptedData: string): Promise<any> {
  try {
    // Decode from base64
    const combined = decodeBase64(encryptedData);
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, IV_LENGTH);
    const encryptedBytes = combined.slice(IV_LENGTH);
    
    // Import key for Web Crypto API
    const key = await globalThis.crypto.subtle.importKey(
      'raw',
      ENCRYPTION_KEY,
      { name: ALGORITHM, length: KEY_LENGTH },
      false,
      ['decrypt']
    );
    
    // Decrypt the data
    const decryptedBytes = await globalThis.crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      encryptedBytes
    );
    
    // Convert back to JSON
    const plaintext = new TextDecoder().decode(decryptedBytes);
    return JSON.parse(plaintext);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Hash sensitive identifiers using SHA-256
 * Used for pseudonymization in BigQuery
 */
export async function hashIdentifier(identifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(identifier);
  const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Encrypt only specific sensitive fields
 * Useful for partial encryption of user profiles
 */
export async function encryptFields(data: any, fields: string[]): Promise<any> {
  const encrypted = { ...data };
  
  for (const field of fields) {
    if (encrypted[field] !== undefined && encrypted[field] !== null) {
      encrypted[field] = await encrypt(encrypted[field]);
      encrypted[`${field}_encrypted`] = true;
    }
  }
  
  return encrypted;
}

/**
 * Decrypt only specific encrypted fields
 */
export async function decryptFields(data: any, fields: string[]): Promise<any> {
  const decrypted = { ...data };
  
  for (const field of fields) {
    if (decrypted[`${field}_encrypted`] && decrypted[field]) {
      try {
        decrypted[field] = await decrypt(decrypted[field]);
        delete decrypted[`${field}_encrypted`];
      } catch (error) {
        console.warn(`Failed to decrypt field ${field}:`, error);
      }
    }
  }
  
  return decrypted;
}

/**
 * Generate encryption key (for initial setup)
 * Run this once and store the output in ENCRYPTION_KEY_BASE64 env var
 */
export function generateEncryptionKey(): string {
  const key = globalThis.crypto.getRandomValues(new Uint8Array(32));
  return encodeBase64(key);
}

// Log encryption status on module load
if (Deno.env.get('ENCRYPTION_KEY_BASE64')) {
  console.log('🔐 AES-256-GCM encryption enabled with persistent key');
} else {
  console.warn('⚠️  Using ephemeral encryption key - NOT suitable for production!');
  console.warn('⚠️  Generate a key and set ENCRYPTION_KEY_BASE64 environment variable');
}
