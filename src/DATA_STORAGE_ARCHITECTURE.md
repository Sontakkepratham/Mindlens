# MindLens Data Storage Architecture

## 📊 Complete Data Storage Overview

MindLens uses a **dual-storage architecture** combining **Supabase** for operational data and **Google BigQuery** for ML training and analytics.

---

## 🗄️ Storage Systems

### 1. **Supabase Key-Value Store** (Primary Storage)
**Location:** `/supabase/functions/server/kv_store.tsx`

**Purpose:** Fast, encrypted storage for all user operational data

**What's Stored:**
- ✅ **User Profiles** - Authentication data, basic info
- ✅ **PHQ-9 Assessments** - Complete questionnaire responses
- ✅ **Emotion Analysis** - AI-detected emotions from facial scans
- ✅ **Session Bookings** - Counselor appointments
- ✅ **Crisis Alerts** - Emergency triggers and actions
- ✅ **Assessment History** - User's complete assessment timeline
- ✅ **Booking History** - All scheduled/past sessions
- ✅ **Research Data** - De-identified data for users who consented

**Key Storage Pattern:**
```
assessment:{sessionId}           → Full assessment record
user:{userId}:latest-assessment  → Most recent assessment ID
user:{userId}:assessment-history → Array of all assessment IDs
user:{userId}:latest-booking     → Most recent booking ID
user:{userId}:booking-history    → Array of all booking IDs
booking:{bookingId}              → Booking details
crisis-alert:{sessionId}         → Crisis incident data
research:{sessionId}             → De-identified research data
emergency:{alertId}              → Emergency alert records
```

**Storage Location:** Supabase Postgres database (table: `kv_store_aa629e1b`)

**Access:** Server-side only via `/utils/supabase/kv_store.tsx`

---

### 2. **Google BigQuery** (ML Training & Analytics)
**Location:** `/supabase/functions/server/bigquery-service.tsx`

**Purpose:** Machine learning, AI training, and HIPAA-compliant analytics

**Dataset:** `mindlens_ml_training`

**Tables:**

#### **Table 1: `assessment_records`**
Stores all PHQ-9 questionnaire data for ML training
```sql
- assessment_id: STRING (Primary Key)
- user_hash: STRING (SHA-256 pseudonymized)
- timestamp: TIMESTAMP
- phq9_q1 through phq9_q9: INTEGER (0-3 scale)
- phq9_total_score: INTEGER (0-27)
- severity_level: STRING (minimal/mild/moderate/moderately-severe/severe)
- requires_immediate_action: BOOLEAN
- age_range: STRING (optional)
- gender: STRING (optional)
- timezone: STRING (optional)
- consent_research: BOOLEAN
```

**Partitioning:** Daily by timestamp
**Clustering:** By severity_level, user_hash

---

#### **Table 2: `emotion_analysis`**
Stores facial emotion detection results from Vertex AI
```sql
- analysis_id: STRING (Primary Key)
- assessment_id: STRING (Foreign Key)
- user_hash: STRING (SHA-256 pseudonymized)
- timestamp: TIMESTAMP
- primary_emotion: STRING (Neutral/Sadness/Anxiety/etc.)
- secondary_emotion: STRING
- confidence_score: FLOAT (0.0-1.0)
- facial_landmarks_detected: BOOLEAN
- sadness_score: FLOAT
- anxiety_score: FLOAT
- neutral_score: FLOAT
- happiness_score: FLOAT
- anger_score: FLOAT
- fear_score: FLOAT
- vertex_ai_model_version: STRING
```

**Partitioning:** Daily by timestamp

---

#### **Table 3: `user_behavior_patterns`**
Tracks user engagement and mental health trends over time
```sql
- behavior_id: STRING (Primary Key)
- user_hash: STRING (SHA-256 pseudonymized)
- timestamp: TIMESTAMP
- assessment_count: INTEGER
- days_between_assessments: INTEGER
- score_trend: STRING (improving/declining/stable)
- engagement_level: STRING (high/medium/low)
- session_count: INTEGER (counseling sessions)
- last_session_days_ago: INTEGER
- crisis_alerts_count: INTEGER
```

**Use Case:** Predict relapse risk, identify disengagement, measure treatment effectiveness

---

#### **Table 4: `session_outcomes`**
Tracks counseling session effectiveness
```sql
- session_id: STRING (Primary Key)
- user_hash: STRING (SHA-256 pseudonymized)
- counselor_hash: STRING (SHA-256 pseudonymized)
- session_date: TIMESTAMP
- pre_session_phq9: INTEGER
- post_session_phq9: INTEGER
- score_improvement: INTEGER (pre - post)
- session_duration_minutes: INTEGER
- user_satisfaction_rating: INTEGER (1-5)
- follow_up_scheduled: BOOLEAN
```

**Use Case:** Measure counselor effectiveness, identify best treatments

---

## 🔐 Security & Encryption

### **1. Data Encryption**
- ✅ **At Rest:** All Supabase data encrypted with AES-256
- ✅ **In Transit:** TLS 1.3 for all API calls
- ✅ **BigQuery:** Google-managed encryption keys

### **2. Pseudonymization (HIPAA Compliance)**
- ✅ User IDs hashed with SHA-256 + salt before BigQuery storage
- ✅ No PII (name, email, phone) stored in BigQuery
- ✅ Only de-identified data used for ML training

```typescript
// Hash function with salt
async function hashUserId(userId: string): Promise<string> {
  const data = userId + 'MINDLENS_SALT_2025';
  const hash = await crypto.subtle.digest('SHA-256', data);
  return hexString(hash); // Returns SHA-256 hash
}
```

### **3. Access Control**
- ✅ **Supabase:** Row-level security (RLS) enforced
- ✅ **BigQuery:** Service account with least-privilege access
- ✅ **API:** JWT-based authentication (Supabase Auth)

---

## 🔄 Data Flow

### **Assessment Submission Flow:**

```
User Completes PHQ-9 Questionnaire
         ↓
Frontend sends to /assessment/submit
         ↓
Server validates auth token
         ↓
┌────────────────────────────────────┐
│  DUAL STORAGE (Parallel Writes)   │
├────────────────┬───────────────────┤
│ Supabase KV    │  Google BigQuery  │
├────────────────┼───────────────────┤
│ • Full record  │  • Pseudonymized  │
│ • User ID      │  • User hash      │
│ • Encrypted    │  • ML-ready       │
│ • Fast access  │  • Analytics      │
└────────────────┴───────────────────┘
         ↓
Crisis detection (if PHQ-9 ≥ 20 or Q9 ≥ 2)
         ↓
Return results to user
```

---

## 📍 Storage Locations Summary

| **Data Type** | **Primary Storage** | **Secondary Storage** | **Purpose** |
|---------------|--------------------|-----------------------|-------------|
| User Profile | Supabase KV | - | Authentication, user management |
| PHQ-9 Responses | Supabase KV | BigQuery `assessment_records` | Operational + ML training |
| Emotion Analysis | Supabase KV | BigQuery `emotion_analysis` | Operational + AI model training |
| Session Bookings | Supabase KV | - | Appointment management |
| Behavior Patterns | - | BigQuery `user_behavior_patterns` | Trend analysis, predictions |
| Session Outcomes | - | BigQuery `session_outcomes` | Treatment effectiveness |
| Crisis Alerts | Supabase KV | - | Emergency response |
| Research Data | Supabase KV | BigQuery (via consent flag) | De-identified research |

---

## 🔍 Data Access Patterns

### **User Data Retrieval**
```typescript
// Get user's latest assessment
const latestId = await kv.get(`user:${userId}:latest-assessment`);
const assessment = await kv.get(`assessment:${latestId}`);

// Get user's complete history
const history = await kv.get(`user:${userId}:assessment-history`);
```

### **ML Training Data Retrieval**
```typescript
// Query BigQuery for ML training (only consented users)
SELECT a.*, e.primary_emotion, b.score_trend
FROM assessment_records a
LEFT JOIN emotion_analysis e ON a.assessment_id = e.assessment_id
LEFT JOIN user_behavior_patterns b ON a.user_hash = b.user_hash
WHERE a.consent_research = TRUE
ORDER BY a.timestamp DESC
LIMIT 10000;
```

---

## 📊 What Gets Stored for Each User Action

### **1. Sign Up**
```
Supabase Auth:
  - user_id (UUID)
  - email (encrypted)
  - password_hash
  - created_at

Supabase KV:
  - user:{userId} → { name, email, created_at }
```

### **2. PHQ-9 Assessment Submission**
```
Supabase KV:
  - assessment:{sessionId} → {
      userId, sessionId, timestamp,
      phqResponses: [0,1,2,1,1,0,2,1,2],
      phqScore: 10,
      emotionAnalysis: {...},
      encrypted: true,
      requiresImmediateAction: false,
      consentToResearch: true
    }
  - user:{userId}:latest-assessment → sessionId
  - user:{userId}:assessment-history → [...sessionIds]

BigQuery assessment_records:
  - assessment_id: "MS-1234567890"
  - user_hash: "a3f5d9..." (SHA-256)
  - phq9_q1: 0, phq9_q2: 1, ..., phq9_q9: 2
  - phq9_total_score: 10
  - severity_level: "moderate"
  - requires_immediate_action: false
  - consent_research: true

BigQuery emotion_analysis:
  - analysis_id: "EMOTION-MS-1234567890"
  - assessment_id: "MS-1234567890"
  - user_hash: "a3f5d9..."
  - primary_emotion: "Neutral"
  - sadness_score: 0.65
  - anxiety_score: 0.42
  - confidence_score: 0.82

BigQuery user_behavior_patterns:
  - user_hash: "a3f5d9..."
  - assessment_count: 3
  - score_trend: "improving"
  - engagement_level: "medium"
```

### **3. Book Counselor Session**
```
Supabase KV:
  - booking:{bookingId} → {
      bookingId, sessionNumber,
      userId, counselorId,
      scheduledDate, scheduledTime,
      meetingLink, status: "confirmed",
      encrypted: true
    }
  - user:{userId}:latest-booking → bookingId
  - user:{userId}:booking-history → [...bookingIds]
```

### **4. Personality Test (NEW)**
**Currently:** Stored in frontend state only (not persisted to backend)

**Recommendation:** Add personality test storage if needed:
```typescript
// Future enhancement - store personality results
POST /personality/submit
{
  userId: "xxx",
  results: {
    openness: 75,
    conscientiousness: 60,
    extraversion: 45,
    agreeableness: 80,
    neuroticism: 50
  }
}

// Store in KV
personality:{sessionId} → { userId, results, timestamp }
```

---

## 🚨 Crisis & Safety Data

### **Crisis Alert Triggers**
```
Triggers when:
  - PHQ-9 total score ≥ 20 (Severe depression)
  - Question 9 response ≥ 2 (Self-harm thoughts)

Stored:
  crisis-alert:{sessionId} → {
    userId, sessionId,
    severity: "critical",
    timestamp,
    actionTaken: "Crisis counselor notified"
  }

Logged:
  Console: "🚨 CRISIS ALERT: {userId}, {sessionId}, {phqScore}"
```

---

## 📈 ML Training Data Pipeline

```
1. User submits assessment with research consent
   ↓
2. Data written to BigQuery (pseudonymized)
   ↓
3. ML service queries training data
   ↓
4. Export to Cloud Storage as JSONL
   gs://mindlens-ml-training/exports/training-data-{timestamp}.jsonl
   ↓
5. Vertex AI imports for model training
   ↓
6. Updated model deployed to production
```

---

## 🔧 Environment Variables Required

```bash
# Supabase (Provided)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Google Cloud (Provided)
GOOGLE_CLOUD_CREDENTIALS={
  "type": "service_account",
  "project_id": "mindlens-production",
  "private_key_id": "xxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nxxx\n-----END PRIVATE KEY-----\n",
  "client_email": "mindlens-sa@xxx.iam.gserviceaccount.com",
  ...
}
```

---

## 📝 Data Retention Policy

### **Operational Data (Supabase)**
- ✅ Stored indefinitely while user account active
- ✅ Deleted within 30 days of account deletion request
- ✅ Encrypted backups retained for 90 days

### **Research Data (BigQuery)**
- ✅ Stored only with explicit user consent
- ✅ Pseudonymized (no direct PII)
- ✅ Can be removed via user request (hash-based deletion)
- ✅ Retained for minimum 5 years for longitudinal studies

---

## 🎯 Summary

**All user data is stored in:**

1. **Supabase Postgres Database**
   - Table: `kv_store_aa629e1b`
   - Contains: User profiles, assessments, bookings, crisis alerts
   - Access: Server-side via key-value functions

2. **Google BigQuery**
   - Dataset: `mindlens_ml_training`
   - Tables: `assessment_records`, `emotion_analysis`, `user_behavior_patterns`, `session_outcomes`
   - Contains: Pseudonymized ML training data
   - Access: Server-side via BigQuery service

3. **Supabase Auth**
   - User authentication credentials
   - Email, password hashes, session tokens

**Security:** AES-256 encryption, SHA-256 hashing, HIPAA-compliant pseudonymization

**Compliance:** HIPAA-ready architecture with consent management, audit logs, and data anonymization
