# MindLens Data Access Guide

Complete guide to accessing and managing your data across all storage systems.

---

## 📊 Overview: Where Your Data Lives

```
MindLens Data Storage
│
├─ 1. Supabase PostgreSQL (KV Store)
│     └─ Encrypted user data, assessments, profiles
│
├─ 2. Supabase Auth
│     └─ User accounts, sessions, authentication
│
├─ 3. Google BigQuery (Optional)
│     └─ Pseudonymized analytics, ML training data
│
└─ 4. Server Logs
      └─ Audit trail, security events
```

---

## 🗄️ Method 1: Supabase Dashboard (Main Database)

### Access the Database

1. **Go to Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Login with your Supabase account

2. **Select Your Project**
   - Click on your MindLens project

3. **Navigate to Table Editor**
   - Left sidebar → Click "Table Editor"
   - Or: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/editor

### View the KV Store Table

4. **Open the KV Store**
   - Find table: `kv_store_aa629e1b`
   - Click to view all records

5. **Table Structure**
   ```
   ┌─────────────────────┬─────────────────────┐
   │ key (TEXT)          │ value (JSONB)       │
   ├─────────────────────┼─────────────────────┤
   │ user:{userId}       │ {profile data}      │
   │ assessment:{id}     │ {encrypted data}    │
   │ bigfive:{userId}    │ {personality data}  │
   │ stroop:{resultId}   │ {test results}      │
   │ booking:{bookingId} │ {session booking}   │
   └─────────────────────┴─────────────────────┘
   ```

### Query Specific Data

6. **Use SQL Editor**
   - Left sidebar → Click "SQL Editor"
   - Or: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql

7. **Example Queries**

```sql
-- Get all keys (to see what data exists)
SELECT key FROM kv_store_aa629e1b ORDER BY key;

-- Get specific user profile
SELECT * FROM kv_store_aa629e1b 
WHERE key = 'user:YOUR_USER_ID';

-- Get all assessments
SELECT * FROM kv_store_aa629e1b 
WHERE key LIKE 'assessment:%';

-- Get user's assessment history
SELECT * FROM kv_store_aa629e1b 
WHERE key = 'user:YOUR_USER_ID:assessment-history';

-- Get specific assessment by session ID
SELECT * FROM kv_store_aa629e1b 
WHERE key = 'assessment:MS-1234567890-abc123';

-- Get all Big Five personality tests
SELECT * FROM kv_store_aa629e1b 
WHERE key LIKE 'bigfive:%';

-- Get all Stroop test results
SELECT * FROM kv_store_aa629e1b 
WHERE key LIKE 'stroop:%';

-- Get all bookings
SELECT * FROM kv_store_aa629e1b 
WHERE key LIKE 'booking:%';

-- Get crisis alerts
SELECT * FROM kv_store_aa629e1b 
WHERE key LIKE 'crisis-alert:%';

-- Count total assessments
SELECT COUNT(*) FROM kv_store_aa629e1b 
WHERE key LIKE 'assessment:%';

-- Get recent assessments (using JSONB query)
SELECT key, value->>'timestamp' as timestamp, value->>'phqScore' as score
FROM kv_store_aa629e1b 
WHERE key LIKE 'assessment:%'
ORDER BY value->>'timestamp' DESC
LIMIT 10;
```

### Understanding Encrypted Data

8. **What You'll See**

```json
{
  "userId": "a3b5c7d9e1f2..." // SHA-256 hash (not readable)
  "sessionId": "MS-1732309876-xyz123",
  "timestamp": "2025-11-22T15:30:00.000Z",
  "encryptedData": "SGVsbG8gV29ybGQ=...", // Base64 encrypted blob
  "encrypted": true,
  "phqScore": 15, // Metadata copy (not encrypted)
  "requiresImmediateAction": false,
  "consentToResearch": true
}
```

**Note**: Sensitive data is in `encryptedData` field and cannot be read directly. Use the API to decrypt.

---

## 👤 Method 2: Supabase Auth Dashboard

### View User Accounts

1. **Go to Authentication**
   - Supabase Dashboard → Left sidebar → "Authentication"
   - Or: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/auth/users

2. **View All Users**
   - See list of all registered users
   - User ID, Email, Created date, Last sign-in

3. **View Individual User**
   - Click on any user to see details:
     - User ID (UUID)
     - Email
     - Email confirmed status
     - Phone (if provided)
     - Created at
     - Last sign-in
     - User metadata

4. **User Metadata Contains**
   ```json
   {
     "name": "John Doe",
     "sub": "user-uuid-here"
   }
   ```

---

## 📊 Method 3: Google BigQuery (Analytics)

### Access BigQuery Console

1. **Go to Google Cloud Console**
   - URL: https://console.cloud.google.com/bigquery
   - Login with your Google account
   - Select project: `mindlens-production` (or your project name)

2. **Find Your Dataset**
   - Left sidebar → Expand your project
   - Look for dataset: `mindlens_ml_training`

3. **View Tables**
   - Click on `mindlens_ml_training` dataset
   - You'll see tables:
     - `assessment_records` - PHQ-9 assessment data
     - `emotion_analysis` - Facial emotion analysis
     - `user_behavior` - Usage patterns
     - `session_outcomes` - Completed sessions

### Query BigQuery Data

4. **Open Query Editor**
   - Click "Compose New Query" button

5. **Example Queries**

```sql
-- View all assessment records
SELECT * FROM `mindlens_ml_training.assessment_records`
LIMIT 100;

-- Count assessments by severity
SELECT 
  severity_level,
  COUNT(*) as count
FROM `mindlens_ml_training.assessment_records`
GROUP BY severity_level
ORDER BY count DESC;

-- Average PHQ-9 score by month
SELECT 
  FORMAT_TIMESTAMP('%Y-%m', timestamp) as month,
  AVG(phq9_score) as avg_score,
  COUNT(*) as total_assessments
FROM `mindlens_ml_training.assessment_records`
GROUP BY month
ORDER BY month DESC;

-- View emotion analysis results
SELECT * FROM `mindlens_ml_training.emotion_analysis`
LIMIT 100;

-- Most common primary emotions
SELECT 
  primary_emotion,
  COUNT(*) as count
FROM `mindlens_ml_training.emotion_analysis`
GROUP BY primary_emotion
ORDER BY count DESC;

-- User behavior patterns (de-identified)
SELECT * FROM `mindlens_ml_training.user_behavior`
LIMIT 100;

-- High-risk assessments (crisis detection)
SELECT 
  assessment_id,
  timestamp,
  phq9_score,
  severity_level
FROM `mindlens_ml_training.assessment_records`
WHERE requires_immediate_action = true
ORDER BY timestamp DESC;

-- Assessments by consent status
SELECT 
  consent_research,
  COUNT(*) as count
FROM `mindlens_ml_training.assessment_records`
GROUP BY consent_research;
```

6. **Important Notes**
   - ✅ All user IDs are SHA-256 hashed (cannot reverse)
   - ✅ No PII (Personally Identifiable Information) stored
   - ✅ Only users who consented to research are included
   - ✅ Data is de-identified and pseudonymized

---

## 🌐 Method 4: Via API Endpoints (User-Facing)

### For End Users (Via Your App)

1. **Export All User Data**

```bash
# Using curl (Terminal/Command Prompt)
curl -X GET "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b/export/my-data" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Save to file
curl -X GET "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b/export/my-data" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -o my-mindlens-data.json
```

2. **Using JavaScript (in your app)**

```javascript
// Get user's access token
const { data: { session } } = await supabase.auth.getSession();
const accessToken = session?.access_token;

// Export data
const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/make-server-aa629e1b/export/my-data`,
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }
);

const userData = await response.json();
console.log(userData);

// Download as file
const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `mindlens-data-${Date.now()}.json`;
a.click();
```

3. **Response Structure**

```json
{
  "exportDate": "2025-11-22T15:30:00.000Z",
  "userId": "uuid-1234-5678",
  "email": "user@example.com",
  "accountCreated": "2025-11-01T10:00:00.000Z",
  
  "profile": {
    "name": "John Doe",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "gender": "Male",
    "location": "New York, USA",
    "emergencyContact": {...}
  },
  
  "assessments": [
    {
      "sessionId": "MS-1732309876-xyz123",
      "timestamp": "2025-11-15T14:30:00.000Z",
      "phqResponses": [0, 1, 2, 1, 2, 3, 1, 2, 0],
      "phqScore": 12,
      "emotionAnalysis": {
        "primaryEmotion": "Neutral",
        "confidence": 0.82
      },
      "requiresImmediateAction": false
    }
  ],
  
  "personalityTest": {
    "openness": 75,
    "conscientiousness": 82,
    "extraversion": 45,
    "agreeableness": 88,
    "neuroticism": 52
  },
  
  "stroopTest": {
    "difficulty": "medium",
    "avgReactionTime": 847,
    "errorRate": 0.12,
    "negativeBias": 123
  },
  
  "dataPolicy": {
    "retention": "7 years from last activity",
    "encryption": "AES-256-GCM",
    "compliance": ["HIPAA", "GDPR"]
  }
}
```

---

## 🔍 Method 5: Server Logs (Audit Trail)

### Access Server Logs

1. **Via Supabase Dashboard**
   - Dashboard → Edge Functions → Click "server" function
   - Click "Logs" tab
   - View real-time server logs

2. **What's Logged**

```
✅ Authentication events
   "User signed in: user-id-8chars***"

✅ Assessment submissions
   "🔐 Assessment submitted: {userId: '***', sessionId: 'MS-123', encrypted: true}"

✅ Crisis alerts
   "🚨 CRISIS ALERT: {userId: '***', phqScore: 21, action: 'Emergency protocol activated'}"

✅ Data exports
   "Data export requested by user: user-id-8chars***"

✅ Account deletions
   "⚠️  Account deletion requested by user: user-id-8chars***"

✅ Encryption status
   "🔐 AES-256-GCM encryption enabled with persistent key"

✅ BigQuery operations
   "✅ BigQuery ready for ML training"
```

3. **Filter Logs**
   - Use search box to filter by:
     - User ID
     - Session ID
     - Error messages
     - Timestamps

---

## 🛠️ Method 6: Programmatic Access (For Developers)

### Direct Database Access (Backend Only)

1. **Using Supabase Client**

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SERVICE_ROLE_KEY' // ⚠️ Backend only, never expose!
);

// Query KV store directly
const { data, error } = await supabase
  .from('kv_store_aa629e1b')
  .select('*')
  .eq('key', 'user:USER_ID');

console.log(data);
```

2. **Using KV Store Utility (Server-Side)**

```typescript
import * as kv from './supabase/functions/server/kv_store.tsx';

// Get user profile
const profile = await kv.get('user:USER_ID');

// Get assessment
const assessment = await kv.get('assessment:SESSION_ID');

// Get all assessments for a user
const historyKey = 'user:USER_ID:assessment-history';
const assessmentIds = await kv.get(historyKey);

// Get multiple assessments
const assessments = await kv.mget(
  assessmentIds.map(id => `assessment:${id}`)
);

// Search by prefix
const allUsers = await kv.getByPrefix('user:');
const allAssessments = await kv.getByPrefix('assessment:');
```

3. **Decrypt Data (Server-Side)**

```typescript
import * as encryption from './supabase/functions/server/encryption-service.tsx';

// Get encrypted assessment
const assessment = await kv.get('assessment:SESSION_ID');

// Decrypt sensitive data
if (assessment.encrypted && assessment.encryptedData) {
  const decrypted = await encryption.decrypt(assessment.encryptedData);
  
  console.log('Decrypted data:', {
    userId: decrypted.userId,
    phqResponses: decrypted.phqResponses,
    phqScore: decrypted.phqScore,
    emotionAnalysis: decrypted.emotionAnalysis
  });
}
```

---

## 📥 Method 7: Bulk Data Export (Admin)

### Export All Data from Supabase

1. **Via Supabase Dashboard**
   - Dashboard → Database → Backups
   - Click "Download Backup"
   - Get full PostgreSQL dump

2. **Via SQL Export**

```sql
-- Export to CSV
COPY (
  SELECT * FROM kv_store_aa629e1b
) TO STDOUT WITH CSV HEADER;

-- Export specific data type
COPY (
  SELECT * FROM kv_store_aa629e1b 
  WHERE key LIKE 'assessment:%'
) TO STDOUT WITH CSV HEADER;
```

3. **Via Supabase CLI**

```bash
# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_ID

# Dump database
supabase db dump -f backup.sql

# Or use pg_dump directly
pg_dump YOUR_DATABASE_URL > mindlens_backup.sql
```

---

## 🔐 Security Considerations When Accessing Data

### ⚠️ Important Security Rules

1. **Never Log Sensitive Data**
   ```typescript
   // ❌ DON'T DO THIS
   console.log('User data:', userData);
   
   // ✅ DO THIS
   console.log('User data accessed:', {
     userId: userId.substring(0, 8) + '***',
     dataType: 'assessment',
     encrypted: true
   });
   ```

2. **Always Verify Authentication**
   ```typescript
   // Before accessing any user data
   const { data: { user }, error } = await supabase.auth.getUser(accessToken);
   if (!user) {
     throw new Error('Unauthorized');
   }
   ```

3. **Decrypt Only When Necessary**
   ```typescript
   // Only decrypt when user explicitly requests their data
   // Don't decrypt for analytics or logging
   ```

4. **Use Service Role Key Carefully**
   ```typescript
   // ⚠️ NEVER expose service role key in frontend
   // Only use in backend/Edge Functions
   ```

---

## 📊 Quick Reference: Data Location Map

| Data Type | Primary Location | Access Method | Encrypted? |
|-----------|-----------------|---------------|------------|
| **User Accounts** | Supabase Auth | Auth Dashboard | ✅ Yes |
| **User Profiles** | KV Store: `user:{id}` | Database/API | ✅ Yes |
| **PHQ-9 Assessments** | KV Store: `assessment:{id}` | Database/API | ✅ Yes (AES-256) |
| **Assessment History** | KV Store: `user:{id}:assessment-history` | Database/API | No (list of IDs) |
| **Big Five Tests** | KV Store: `bigfive:{id}` | Database/API | ✅ Yes |
| **Stroop Tests** | KV Store: `stroop:{id}` | Database/API | ✅ Yes |
| **Session Bookings** | KV Store: `booking:{id}` | Database/API | ✅ Yes |
| **Crisis Alerts** | KV Store: `crisis-alert:{id}` | Database/API | No (metadata) |
| **Research Data** | BigQuery: `assessment_records` | BigQuery Console | Pseudonymized |
| **Emotion Analysis** | BigQuery: `emotion_analysis` | BigQuery Console | Pseudonymized |
| **Audit Logs** | Server Logs | Supabase Functions | No (redacted) |

---

## 🎯 Common Data Access Scenarios

### Scenario 1: User Wants Their Data
**Solution**: Use the export endpoint
```bash
GET /export/my-data
```

### Scenario 2: Admin Wants to See All Assessments
**Solution**: Query Supabase database
```sql
SELECT * FROM kv_store_aa629e1b WHERE key LIKE 'assessment:%';
```

### Scenario 3: Data Scientist Wants ML Training Data
**Solution**: Query BigQuery (de-identified)
```sql
SELECT * FROM mindlens_ml_training.assessment_records;
```

### Scenario 4: Compliance Audit
**Solution**: Export audit logs from Supabase Functions
- Dashboard → Functions → Logs → Export

### Scenario 5: User Deletes Account
**Solution**: All data automatically deleted via API
```bash
DELETE /export/delete-account
```

---

## ⚡ Quick Access Checklist

Before accessing data, ensure:

- [ ] You have proper authentication (user token or service role key)
- [ ] You're accessing only authorized data (own data or admin role)
- [ ] You're following data minimization (only access what's needed)
- [ ] You're not logging sensitive information
- [ ] You're using encrypted connections (HTTPS)
- [ ] You're documenting access for audit trail

---

## 📞 Need Help?

- **Can't find data**: Check the key format in the data location map above
- **Encrypted data unreadable**: Use the `/export/my-data` API endpoint to decrypt
- **BigQuery not working**: Verify `GOOGLE_CLOUD_CREDENTIALS` is set
- **Access denied**: Verify authentication token and permissions

---

**Last Updated**: November 22, 2025  
**Next**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for setup instructions
