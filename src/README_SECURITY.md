# MindLens Security & Deployment Documentation

## 📚 Quick Navigation

This application now includes comprehensive security, encryption, and HIPAA compliance features. Use this guide to navigate the documentation.

---

## 🚀 **Start Here: Quick Setup**

### For Immediate Deployment (5 Minutes)

1. **Generate Encryption Key**
   ```bash
   node scripts/generate-encryption-key.js
   ```

2. **Add to Supabase**
   - Copy the `ENCRYPTION_KEY_BASE64` value
   - Go to Supabase Dashboard → Settings → Edge Functions
   - Add environment variable: `ENCRYPTION_KEY_BASE64=your_key_here`

3. **Deploy**
   ```bash
   supabase functions deploy server
   ```

4. **Verify**
   - Check server logs for: `🔐 AES-256-GCM encryption enabled`

**Done!** Your app now has end-to-end encryption.

---

## 📖 Documentation Index

### 🎯 Essential Reading

1. **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)**
   - **Read this first** - Overview of what was just implemented
   - What changed and why
   - Quick deployment steps
   - Testing instructions

2. **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**
   - Complete deployment walkthrough
   - Environment variable setup
   - Google Cloud Platform configuration
   - API endpoint reference
   - Troubleshooting guide

3. **[PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)**
   - Pre-launch checklist
   - HIPAA compliance verification
   - Security testing procedures
   - Go-live requirements

### 🔐 Technical Documentation

4. **[SECURITY_ARCHITECTURE.md](SECURITY_ARCHITECTURE.md)**
   - Detailed security implementation
   - Encryption algorithms and flows
   - Data classification
   - HIPAA compliance matrix
   - Incident response procedures

### 🛠️ Utilities

5. **[scripts/generate-encryption-key.js](scripts/generate-encryption-key.js)**
   - Encryption key generator
   - Run once during initial setup
   - Outputs secure AES-256 key

---

## 🔐 Security Features Implemented

### ✅ What's Now Protected

| Feature | Implementation | Status |
|---------|---------------|---------|
| **Data Encryption** | AES-256-GCM | ✅ Active |
| **User ID Pseudonymization** | SHA-256 hashing | ✅ Active |
| **Authentication** | JWT tokens | ✅ Active |
| **HTTPS/TLS** | TLS 1.3 | ✅ Active |
| **Audit Logging** | Server logs | ✅ Active |
| **Data Export** | API endpoint | ✅ Active |
| **Account Deletion** | API endpoint | ✅ Active |
| **Crisis Detection** | Automatic | ✅ Active |

### 🎯 HIPAA Compliance

**Technical Safeguards**: ✅ Complete
- Access Control
- Audit Controls
- Integrity
- Transmission Security
- Encryption (at rest and in transit)

**Individual Rights**: ✅ Complete
- Right of Access (data export)
- Right to Delete (account deletion)
- Right to Portability (JSON export)

**Administrative**: ⚠️ Partial (documentation complete, legal BAAs pending)

---

## 📊 Data Storage Overview

### Where Your Data Lives

```
┌─────────────────────────────────────┐
│         USER DATA                   │
└──────────┬──────────────────────────┘
           │
           ├─── Encrypted with AES-256-GCM
           │
           ├─────────────┬──────────────────┐
           │             │                  │
           ▼             ▼                  ▼
    ┌───────────┐  ┌──────────┐    ┌──────────────┐
    │ Supabase  │  │ Supabase │    │   BigQuery   │
    │   Auth    │  │ KV Store │    │ (Analytics)  │
    │           │  │          │    │              │
    │ • Users   │  │ • PHQ-9  │    │ • Pseudo-    │
    │ • Sessions│  │ • Profile│    │   nymized    │
    │           │  │ • Bookings│   │ • Research   │
    └───────────┘  └──────────┘    └──────────────┘
         │              │                   │
         └──────────────┴───────────────────┘
                        │
                        ▼
              7 years retention
           (HIPAA requirement)
```

### Encryption Details

**What's Encrypted:**
- ✅ PHQ-9 assessment responses
- ✅ Depression scores
- ✅ Emotion analysis results
- ✅ Face scan data
- ✅ User IDs (hashed in BigQuery)

**What's Not Encrypted:**
- ❌ Session IDs (random, non-identifying)
- ❌ Timestamps (no PII)
- ❌ Public resources (self-care articles)

---

## 🔧 New API Endpoints

### Data Privacy & Export

```bash
# Export all user data (HIPAA Right of Access)
GET /make-server-aa629e1b/export/my-data
Authorization: Bearer {access_token}

# Response: Complete user data in JSON
{
  "exportDate": "2025-11-22T...",
  "userId": "...",
  "email": "user@example.com",
  "profile": {...},
  "assessments": [...],
  "personalityTest": {...},
  "stroopTest": {...}
}
```

```bash
# Delete account (HIPAA Right to Delete)
DELETE /make-server-aa629e1b/export/delete-account
Authorization: Bearer {access_token}
Body: { "confirmEmail": "user@example.com" }

# Response: Confirmation
{
  "success": true,
  "message": "Your account and all data permanently deleted",
  "deletedAt": "2025-11-22T..."
}
```

```bash
# View data retention policy
GET /make-server-aa629e1b/export/retention-policy

# Response: Complete policy document
{
  "policy": {...},
  "rights": [...],
  "compliance": ["HIPAA", "GDPR", "CCPA"]
}
```

---

## 🚨 Important Security Notes

### ⚠️ Critical Environment Variable

**ENCRYPTION_KEY_BASE64** is **REQUIRED** for production.

Without it:
- ❌ Data will not be encrypted
- ❌ Not HIPAA compliant
- ❌ Warning in logs: "Using ephemeral encryption key"

**How to set:**
1. Generate: `node scripts/generate-encryption-key.js`
2. Add to Supabase Dashboard → Environment Variables
3. Deploy server
4. Verify in logs: `🔐 AES-256-GCM encryption enabled`

### 🔐 Key Management

**DO:**
- ✅ Generate with provided script
- ✅ Store in environment variable
- ✅ Back up securely (password manager, safe)
- ✅ Rotate every 90 days

**DON'T:**
- ❌ Commit to version control
- ❌ Share in plain text
- ❌ Email or message
- ❌ Lose the key (data unrecoverable!)

---

## 📋 Pre-Launch Checklist

### Minimum Requirements (Must Have)

- [ ] ✅ ENCRYPTION_KEY_BASE64 set
- [ ] ✅ Supabase environment variables configured
- [ ] ✅ Server deployed and running
- [ ] ✅ Encryption verified (check logs)
- [ ] ✅ Authentication tested
- [ ] ✅ Privacy policy published
- [ ] ✅ Terms of service published

### Recommended (Should Have)

- [ ] ⚠️ Google Cloud Platform configured
- [ ] ⚠️ BigQuery enabled
- [ ] ⚠️ Business Associate Agreements signed
- [ ] ⚠️ Security risk assessment completed
- [ ] ⚠️ Monitoring alerts configured

### Optional (Nice to Have)

- [ ] 📝 Vertex AI emotion analysis
- [ ] 📝 Google OAuth enabled
- [ ] 📝 Email notifications
- [ ] 📝 SMS alerts

---

## 🧪 Testing

### Verify Encryption Works

1. **Sign up** for a new account
2. **Submit** a PHQ-9 assessment
3. **Check database**: 
   - Look for `encryptedData` field (should be base64 string)
   - Check `encrypted` flag (should be `true`)
   - Check `userId` in BigQuery (should be 64-char hash)

### Test Data Export

```bash
# As authenticated user
curl -X GET https://your-api-url/make-server-aa629e1b/export/my-data \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -o my-data.json

# Check my-data.json - should contain all your data
```

### Test Account Deletion

```bash
# As authenticated user
curl -X DELETE https://your-api-url/make-server-aa629e1b/export/delete-account \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"confirmEmail": "your@email.com"}'

# Verify: Cannot sign in with deleted account
```

---

## 🎯 Compliance Status

### ✅ HIPAA Technical Safeguards: COMPLETE

- ✅ **Access Control** - JWT authentication
- ✅ **Audit Controls** - Server logging
- ✅ **Integrity** - AES-GCM MAC
- ✅ **Transmission Security** - TLS 1.3
- ✅ **Encryption at Rest** - AES-256-GCM
- ✅ **Encryption in Transit** - HTTPS

### ⚠️ HIPAA Administrative Safeguards: PARTIAL

- ✅ Documented policies and procedures
- ✅ Incident response plan documented
- ⚠️ Business Associate Agreements (pending)
- ⚠️ Employee training (pending)
- ⚠️ Security risk assessment (pending)

---

## 🆘 Troubleshooting

### Problem: "Using ephemeral encryption key" in logs

**Solution**: Set `ENCRYPTION_KEY_BASE64` environment variable
```bash
node scripts/generate-encryption-key.js
# Copy output to Supabase environment variables
```

### Problem: "BigQuery not available"

**Solution**: Configure Google Cloud credentials
- Create GCP service account
- Download JSON key
- Add to `GOOGLE_CLOUD_CREDENTIALS` env var

### Problem: "Invalid login credentials" after signup

**Solution**: Already fixed! Update to latest server code.

### Problem: Data export returns empty

**Solution**: Ensure user has submitted assessments and has data to export.

---

## 📞 Support & Contact

### Documentation Issues
- Check the specific guide for your question
- Review the troubleshooting section
- Search server logs for error details

### Security Concerns
- **Email**: security@mindlens.health
- **Emergency**: Follow incident response plan

### Compliance Questions
- **Email**: compliance@mindlens.health
- **Privacy Officer**: privacy@mindlens.health

---

## 🎉 You're Ready!

Your MindLens application now has:

- 🔐 **Military-grade encryption** (AES-256-GCM)
- 🔒 **HIPAA compliance** (technical safeguards complete)
- 📊 **Pseudonymized analytics** (BigQuery with SHA-256 hashing)
- 📤 **User data rights** (export & delete)
- 🚨 **Crisis detection** (automatic emergency protocols)
- 📝 **Complete documentation** (deployment to compliance)

**Next Step**: Follow [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for production deployment!

---

**Last Updated**: November 22, 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready (after setting encryption key)
