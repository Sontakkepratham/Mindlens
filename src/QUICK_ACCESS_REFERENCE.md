# MindLens Data Access - Quick Reference Card

## 🎯 Where to Access Your Data (3 Simple Steps)

---

## 📍 **Option 1: Supabase Dashboard (Most Common)**

### For Viewing User Data, Assessments, Profiles

**Step 1:** Login
```
https://supabase.com/dashboard
```

**Step 2:** Navigate
```
Your Project → Table Editor → kv_store_aa629e1b
```

**Step 3:** Query
```sql
-- See all data
SELECT * FROM kv_store_aa629e1b;

-- Get specific user
SELECT * FROM kv_store_aa629e1b 
WHERE key = 'user:YOUR_USER_ID';

-- Get all assessments
SELECT * FROM kv_store_aa629e1b 
WHERE key LIKE 'assessment:%';
```

**Direct Link Template:**
```
https://supabase.com/dashboard/project/YOUR_PROJECT_ID/editor
```

---

## 📍 **Option 2: User Data Export API (For End Users)**

### For Complete User Data Download

**Step 1:** Get Access Token
```javascript
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;
```

**Step 2:** Call Export Endpoint
```bash
curl -X GET \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b/export/my-data" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Step 3:** Download JSON
```javascript
// In your app
const response = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` }});
const data = await response.json();
// Download as file
```

**What You Get:**
- ✅ Complete user profile
- ✅ All PHQ-9 assessments (decrypted)
- ✅ Personality test results
- ✅ Stroop test results
- ✅ Session bookings
- ✅ All data in readable JSON

---

## 📍 **Option 3: Google BigQuery (For Analytics)**

### For Aggregated, De-identified Analytics

**Step 1:** Go to BigQuery
```
https://console.cloud.google.com/bigquery
```

**Step 2:** Select Dataset
```
mindlens-production → mindlens_ml_training
```

**Step 3:** Query Data
```sql
-- View all assessments
SELECT * FROM `mindlens_ml_training.assessment_records`;

-- Average PHQ-9 scores
SELECT AVG(phq9_score) as avg_score 
FROM `mindlens_ml_training.assessment_records`;

-- Severity distribution
SELECT severity_level, COUNT(*) as count
FROM `mindlens_ml_training.assessment_records`
GROUP BY severity_level;
```

**Note:** All data is pseudonymized (no PII)

---

## 🔑 Quick Key Reference

### Where Each Data Type Lives

```
Supabase KV Store Keys:
├─ user:{userId}                          → User profile
├─ user:{userId}:assessment-history       → List of assessment IDs
├─ user:{userId}:latest-assessment        → Most recent assessment ID
├─ user:{userId}:booking-history          → List of booking IDs
├─ user:{userId}:latest-booking           → Most recent booking ID
├─ assessment:{sessionId}                 → PHQ-9 assessment (encrypted)
├─ bigfive:{userId}                       → Big Five personality test
├─ stroop:{resultId}                      → Stroop test results
├─ booking:{bookingId}                    → Counselor session booking
├─ crisis-alert:{sessionId}               → Crisis alert record
└─ research:{sessionId}                   → De-identified research data
```

---

## 🔍 Common SQL Queries (Copy & Paste)

### In Supabase SQL Editor

```sql
-- 1. Count total users
SELECT COUNT(*) FROM kv_store_aa629e1b 
WHERE key LIKE 'user:%' 
AND key NOT LIKE '%:%:%';

-- 2. Count total assessments
SELECT COUNT(*) FROM kv_store_aa629e1b 
WHERE key LIKE 'assessment:%';

-- 3. Get recent assessments with scores
SELECT 
  key,
  value->>'sessionId' as session_id,
  value->>'timestamp' as timestamp,
  value->>'phqScore' as phq_score,
  value->>'requiresImmediateAction' as crisis
FROM kv_store_aa629e1b 
WHERE key LIKE 'assessment:%'
ORDER BY value->>'timestamp' DESC
LIMIT 20;

-- 4. Find crisis alerts
SELECT * FROM kv_store_aa629e1b 
WHERE key LIKE 'crisis-alert:%';

-- 5. Get all bookings
SELECT 
  key,
  value->>'bookingId' as booking_id,
  value->>'counselorId' as counselor,
  value->>'scheduledDate' as date,
  value->>'status' as status
FROM kv_store_aa629e1b 
WHERE key LIKE 'booking:%'
ORDER BY value->>'createdAt' DESC;

-- 6. Count tests by type
SELECT 
  CASE 
    WHEN key LIKE 'assessment:%' THEN 'PHQ-9 Assessments'
    WHEN key LIKE 'bigfive:%' THEN 'Personality Tests'
    WHEN key LIKE 'stroop:%' THEN 'Stroop Tests'
    WHEN key LIKE 'booking:%' THEN 'Session Bookings'
    ELSE 'Other'
  END as data_type,
  COUNT(*) as count
FROM kv_store_aa629e1b
GROUP BY data_type;

-- 7. Get specific user's complete data
SELECT * FROM kv_store_aa629e1b 
WHERE key LIKE 'user:YOUR_USER_ID%';
```

---

## 🌐 API Endpoints Cheat Sheet

### Base URL
```
https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b
```

### All Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| `GET` | `/health` | Check server status | No |
| `POST` | `/auth/signup` | Create account | No |
| `POST` | `/auth/signin` | Sign in | No |
| `POST` | `/auth/google-signin` | Google OAuth | No |
| `GET` | `/auth/me` | Get user info | Yes |
| `POST` | `/assessment/submit` | Submit PHQ-9 | Yes |
| `GET` | `/counselors/recommendations` | Get counselors | Yes |
| `POST` | `/sessions/book` | Book session | Yes |
| `GET` | `/user/dashboard` | Get dashboard | Yes |
| `GET` | `/export/my-data` | **Export all data** | Yes |
| `DELETE` | `/export/delete-account` | Delete account | Yes |
| `GET` | `/export/retention-policy` | View policy | No |
| `GET` | `/export/assessment-summary/:id` | Export assessment | Yes |
| `POST` | `/ai/analyze-face` | Emotion analysis | Yes |
| `POST` | `/stroop/save` | Save Stroop test | No |
| `POST` | `/emergency/trigger` | Crisis alert | Yes |

---

## 🔐 Authentication Quick Guide

### Get Access Token (JavaScript)

```javascript
// After user signs in
const { data: { session } } = await supabase.auth.getSession();
const accessToken = session?.access_token;

// Use in API calls
const response = await fetch(endpoint, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
```

### Get Access Token (curl)

```bash
# Sign in first
curl -X POST \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Response contains access_token
# Use it in subsequent requests
curl -X GET \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b/export/my-data" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📊 BigQuery Quick Queries

```sql
-- Average PHQ-9 score
SELECT AVG(phq9_score) as avg_depression_score
FROM `mindlens_ml_training.assessment_records`;

-- Assessments per month
SELECT 
  FORMAT_TIMESTAMP('%Y-%m', timestamp) as month,
  COUNT(*) as total_assessments,
  AVG(phq9_score) as avg_score
FROM `mindlens_ml_training.assessment_records`
GROUP BY month
ORDER BY month DESC;

-- Severity distribution
SELECT 
  severity_level,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM `mindlens_ml_training.assessment_records`
GROUP BY severity_level
ORDER BY count DESC;

-- Crisis cases
SELECT COUNT(*) as crisis_cases
FROM `mindlens_ml_training.assessment_records`
WHERE requires_immediate_action = true;

-- Most common emotions
SELECT 
  primary_emotion,
  COUNT(*) as count
FROM `mindlens_ml_training.emotion_analysis`
GROUP BY primary_emotion
ORDER BY count DESC;

-- Research consent rate
SELECT 
  consent_research,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM `mindlens_ml_training.assessment_records`
GROUP BY consent_research;
```

---

## 🎯 Finding Specific Data

### I Want to Find...

**A Specific User's Data**
```sql
-- In Supabase
SELECT * FROM kv_store_aa629e1b 
WHERE key LIKE 'user:PASTE_USER_ID_HERE%';
```

**All Assessments from Today**
```sql
SELECT * FROM kv_store_aa629e1b 
WHERE key LIKE 'assessment:%'
AND value->>'timestamp' >= CURRENT_DATE::text;
```

**Users Who Need Crisis Intervention**
```sql
SELECT * FROM kv_store_aa629e1b 
WHERE key LIKE 'crisis-alert:%'
ORDER BY value->>'timestamp' DESC;
```

**All Session Bookings**
```sql
SELECT 
  value->>'sessionNumber' as session,
  value->>'scheduledDate' as date,
  value->>'status' as status
FROM kv_store_aa629e1b 
WHERE key LIKE 'booking:%';
```

**Big Five Personality Results**
```sql
SELECT * FROM kv_store_aa629e1b 
WHERE key LIKE 'bigfive:%';
```

**Stroop Test Results**
```sql
SELECT 
  key,
  value->>'difficulty' as difficulty,
  value->>'avgReactionTime' as reaction_time,
  value->>'errorRate' as error_rate
FROM kv_store_aa629e1b 
WHERE key LIKE 'stroop:%';
```

---

## 💡 Pro Tips

### Tip 1: Export Everything for Backup
```bash
# Full database backup
supabase db dump -f backup.sql

# Or via Supabase Dashboard
Dashboard → Database → Backups → Download
```

### Tip 2: Monitor in Real-Time
```
Dashboard → Edge Functions → server → Logs
(Auto-refreshes every few seconds)
```

### Tip 3: Understanding Encrypted Data
```json
// What you see in database:
{
  "encryptedData": "SGVsbG8gV29ybGQ=..." // ← Cannot read
  "encrypted": true
}

// To decrypt, use API:
GET /export/my-data → Returns decrypted data
```

### Tip 4: Finding a User's ID
```
Dashboard → Authentication → Users → Click user → Copy ID
```

### Tip 5: Quick Health Check
```bash
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b/health
```

---

## 🚨 Emergency Access (Crisis Situations)

If you need to access crisis data immediately:

```sql
-- Find all active crisis alerts
SELECT 
  key,
  value->>'userId' as user_id,
  value->>'sessionId' as session_id,
  value->>'severity' as severity,
  value->>'timestamp' as alert_time,
  value->>'actionTaken' as action
FROM kv_store_aa629e1b 
WHERE key LIKE 'crisis-alert:%'
ORDER BY value->>'timestamp' DESC;

-- Find high-risk assessments
SELECT 
  key,
  value->>'sessionId' as session_id,
  value->>'phqScore' as score,
  value->>'requiresImmediateAction' as needs_action
FROM kv_store_aa629e1b 
WHERE key LIKE 'assessment:%'
AND (value->>'requiresImmediateAction')::boolean = true
ORDER BY value->>'timestamp' DESC;
```

---

## 📱 Mobile Access

### Supabase Mobile App
- Download: iOS App Store / Google Play
- Search: "Supabase"
- Login → View tables and logs on mobile

---

## ⚡ Fastest Access Methods

| What You Need | Fastest Method | Time |
|---------------|----------------|------|
| **User's complete data** | API: `/export/my-data` | 2 seconds |
| **View all assessments** | Supabase SQL Editor | 30 seconds |
| **Analytics & trends** | BigQuery Console | 1 minute |
| **Real-time monitoring** | Supabase Function Logs | Instant |
| **Database backup** | Supabase Backups | 2 minutes |

---

## 🔗 Quick Links

| Resource | URL Template |
|----------|-------------|
| **Supabase Dashboard** | `https://supabase.com/dashboard/project/YOUR_PROJECT_ID` |
| **Table Editor** | `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/editor` |
| **SQL Editor** | `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql` |
| **Authentication** | `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/auth/users` |
| **Edge Functions** | `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/functions` |
| **Function Logs** | `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/functions/server/logs` |
| **BigQuery** | `https://console.cloud.google.com/bigquery?project=mindlens-production` |
| **API Base URL** | `https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b` |

---

## 📖 More Detailed Information

- **Complete Guide**: [DATA_ACCESS_GUIDE.md](DATA_ACCESS_GUIDE.md)
- **Deployment**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Security Details**: [SECURITY_ARCHITECTURE.md](SECURITY_ARCHITECTURE.md)

---

**Print this page for quick reference!** 🖨️
