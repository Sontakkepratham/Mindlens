#!/usr/bin/env node

/**
 * Generate AES-256 Encryption Key for MindLens
 * 
 * Run this script to generate a secure encryption key for HIPAA-compliant data storage.
 * 
 * Usage:
 *   node scripts/generate-encryption-key.js
 * 
 * The output should be added to your environment variables as ENCRYPTION_KEY_BASE64
 */

const crypto = require('crypto');

console.log('\n🔐 MindLens Encryption Key Generator\n');
console.log('=====================================\n');

// Generate 256-bit (32 byte) key
const key = crypto.randomBytes(32);
const keyBase64 = key.toString('base64');

console.log('✅ Successfully generated AES-256 encryption key\n');
console.log('📋 Add this to your environment variables:\n');
console.log('━'.repeat(60));
console.log(`ENCRYPTION_KEY_BASE64=${keyBase64}`);
console.log('━'.repeat(60));

console.log('\n⚠️  SECURITY WARNINGS:');
console.log('   1. Keep this key SECRET - never commit to version control');
console.log('   2. Store in Google Cloud Secret Manager or equivalent');
console.log('   3. Losing this key means all encrypted data is UNRECOVERABLE');
console.log('   4. Rotate keys every 90 days for compliance');

console.log('\n📝 Where to add this key:');
console.log('   • Supabase Dashboard → Settings → Edge Functions → Environment Variables');
console.log('   • Or: Add to .env file (DO NOT commit .env to git)');
console.log('   • Or: Google Cloud Secret Manager (production)');

console.log('\n🔍 Verification:');
console.log(`   Key length: ${key.length} bytes (${key.length * 8} bits)`);
console.log(`   Base64 length: ${keyBase64.length} characters`);
console.log(`   Algorithm: AES-256-GCM`);

console.log('\n✅ Next steps:');
console.log('   1. Copy the ENCRYPTION_KEY_BASE64 value above');
console.log('   2. Add it to your Supabase environment variables');
console.log('   3. Deploy your Edge Functions');
console.log('   4. Verify encryption is working (check server logs)\n');
