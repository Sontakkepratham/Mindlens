# Unified Data Access Guide
## Easy Access to Both Supabase and BigQuery Data

Your MindLens data is now accessible through a **unified API** that combines data from both Supabase and BigQuery automatically!

---

## 🎯 What's New?

Instead of querying Supabase and BigQuery separately, you can now use **one simple API** that:
- ✅ Automatically combines data from both sources
- ✅ Decrypts encrypted data for you
- ✅ Returns everything in one JSON response
- ✅ Provides analytics and statistics
- ✅ Includes search across both databases

---

## 🚀 New Unified Endpoints

### Base URL
```
https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b/data
```

---

## 📊 1. Get Complete User Data

**Get ALL data for a user from both Supabase and BigQuery in one call**

### Endpoint
```
GET /data/user/:userId
Authorization: Bearer {access_token}
```

### Example Request
```bash
curl -X GET \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b/data/user/YOUR_USER_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### JavaScript Example
```javascript
const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/make-server-aa629e1b/data/user/${userId}`,
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }
);

const { data } = await response.json();
console.log(data);
```

### Response Structure
```json
{
  "success": true,
  "data": {
    "userId": "uuid-1234-5678",
    "timestamp": "2025-11-22T...",
    "sources": {
      "supabase": true,
      "bigquery": true
    },
    "data": {
      "profile": {
        "name": "John Doe",
        "email": "user@example.com",
        "phone": "+1234567890"
      },
      "assessments": {
        "count": 5,
        "sessions": [
          {
            "sessionId": "MS-...",
            "timestamp": "2025-11-15T...",
            "phqResponses": [0,1,2,1,2,3,1,2,0],
            "phqScore": 12,
            "emotionAnalysis": {...}
          }
        ]
      },
      "personalityTest": {
        "openness": 75,
        "conscientiousness": 82,
        ...
      },
      "stroopTest": {...},
      "bookings": [...],
      "bigQueryAnalytics": {
        "assessments": [...],
        "totalAssessments": 5,
        "averageScore": 11.2,
        "emotionAnalysis": [...]
      }
    }
  }
}
```

**✅ Everything in ONE response - no need to query multiple places!**

---

## 📋 2. Get Complete Assessment Data

**Get full assessment details from both sources**

### Endpoint
```
GET /data/assessment/:sessionId
Authorization: Bearer {access_token}
```

### Example
```bash
curl -X GET \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b/data/assessment/MS-1234567890-abc123" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Response
```json
{
  "success": true,
  "data": {
    "sessionId": "MS-1234567890-abc123",
    "timestamp": "2025-11-22T...",
    "data": {
      "supabase": {
        "sessionId": "MS-...",
        "phqResponses": [0,1,2,1,2,3,1,2,0],
        "phqScore": 12,
        "emotionAnalysis": {...},
        "timestamp": "..."
      },
      "bigQuery": {
        "assessment_id": "MS-...",
        "phq9_score": 12,
        "severity_level": "moderate",
        "user_hash": "a3b5c7d9..."
      },
      "bigQueryEmotion": {
        "primary_emotion": "Neutral",
        "confidence_score": 0.82
      }
    }
  }
}
```

---

## 📈 3. Get Dashboard Statistics

**Get comprehensive statistics from both databases**

### Endpoint
```
GET /data/dashboard
Authorization: Bearer {access_token}
```

### Example
```bash
curl -X GET \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b/data/dashboard" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Response
```json
{
  "success": true,
  "statistics": {
    "timestamp": "2025-11-22T...",
    "supabase": {
      "totalRecords": 1453,
      "users": 127,
      "assessments": 856,
      "bigFiveTests": 89,
      "stroopTests": 134,
      "bookings": 245,
      "crisisAlerts": 12
    },
    "bigQuery": {
      "totalAssessments": 856,
      "averagePhqScore": 11.3,
      "severityDistribution": [
        { "severity_level": "minimal", "count": 234 },
        { "severity_level": "mild", "count": 412 },
        { "severity_level": "moderate", "count": 156 }
      ],
      "crisisCases": 12,
      "emotionDistribution": [
        { "primary_emotion": "Neutral", "count": 450 },
        { "primary_emotion": "Sadness", "count": 256 }
      ],
      "last30Days": [
        { "date": "2025-11-22", "assessment_count": 15, "avg_score": 10.5 },
        { "date": "2025-11-21", "assessment_count": 12, "avg_score": 11.2 }
      ]
    }
  }
}
```

**Perfect for admin dashboards!**

---

## 🔍 4. Search Across Both Databases

**Search for data in both Supabase and BigQuery simultaneously**

### Endpoint
```
GET /data/search?q={searchTerm}&type={searchType}
Authorization: Bearer {access_token}
```

### Parameters
- `q` - Search term (required)
- `type` - Search type: `userId`, `sessionId`, `email`, or `all` (default: `all`)

### Examples

**Search by User ID:**
```bash
curl -X GET \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b/data/search?q=uuid-1234&type=userId" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Search by Session ID:**
```bash
curl -X GET \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b/data/search?q=MS-1234567890-abc&type=sessionId" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Response
```json
{
  "success": true,
  "results": {
    "searchTerm": "MS-1234567890-abc",
    "searchType": "sessionId",
    "timestamp": "2025-11-22T...",
    "supabase": [
      {
        "type": "assessment",
        "key": "assessment:MS-1234567890-abc",
        "data": {...}
      }
    ],
    "bigQuery": [
      {
        "assessment_id": "MS-1234567890-abc",
        "phq9_score": 12,
        "timestamp": "..."
      }
    ]
  }
}
```

---

## 🔄 5. Sync Supabase to BigQuery

**Manually sync data from Supabase to BigQuery**

### Endpoint
```
POST /data/sync
Authorization: Bearer {access_token}
Body: { "userId": "optional-user-id" }
```

### Examples

**Sync All Users:**
```bash
curl -X POST \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b/data/sync" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Sync Specific User:**
```bash
curl -X POST \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b/data/sync" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": "uuid-1234-5678"}'
```

### Response
```json
{
  "success": true,
  "sync": {
    "timestamp": "2025-11-22T...",
    "assessmentsSynced": 156,
    "emotionsSynced": 0,
    "errors": []
  }
}
```

**Use this to backfill BigQuery or fix sync issues!**

---

## 📊 6. Get Trends & Analytics

**Get time-series analytics from BigQuery**

### Endpoint
```
GET /data/analytics?timeRange={range}
Authorization: Bearer {access_token}
```

### Parameters
- `timeRange` - `7d`, `30d`, `90d`, or `all` (default: `30d`)

### Example
```bash
curl -X GET \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b/data/analytics?timeRange=30d" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Response
```json
{
  "success": true,
  "analytics": {
    "timeRange": "30d",
    "timestamp": "2025-11-22T...",
    "assessmentTrends": [
      {
        "date": "2025-11-22",
        "total_assessments": 15,
        "avg_score": 10.5,
        "crisis_count": 1
      }
    ],
    "severityTrends": [...],
    "emotionTrends": [...],
    "engagement": {
      "totalAssessments": 456,
      "uniqueUsers": 89,
      "avgAssessmentsPerUser": 5.1
    }
  }
}
```

---

## 🔍 7. Check Connection Status

**Verify both Supabase and BigQuery are connected**

### Endpoint
```
GET /data/status
```

### Example
```bash
curl -X GET \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b/data/status"
```

### Response
```json
{
  "healthy": true,
  "status": {
    "timestamp": "2025-11-22T...",
    "supabase": {
      "connected": true,
      "database": true
    },
    "bigQuery": {
      "connected": true,
      "configured": true
    }
  }
}
```

**Check this first to ensure everything is working!**

---

## 🎯 8. Execute Custom BigQuery Queries

**Run your own SQL queries on BigQuery (admin only)**

### Endpoint
```
GET /data/query?sql={yourQuery}
Authorization: Bearer {access_token}
```

### Example
```bash
curl -X GET \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b/data/query" \
  --data-urlencode "sql=SELECT severity_level, COUNT(*) as count FROM \`mindlens_ml_training.assessment_records\` GROUP BY severity_level" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Response
```json
{
  "success": true,
  "query": "SELECT severity_level, COUNT(*) as count ...",
  "rowCount": 5,
  "data": [
    { "severity_level": "minimal", "count": 234 },
    { "severity_level": "mild", "count": 412 },
    { "severity_level": "moderate", "count": 398 }
  ]
}
```

**⚠️ Security Note:** Only SELECT queries allowed, admin authentication required

---

## 💡 Complete Usage Examples

### Example 1: Display User Dashboard

```javascript
// Fetch complete user data
async function loadUserDashboard(userId, accessToken) {
  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-aa629e1b/data/user/${userId}`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    }
  );
  
  const { data } = await response.json();
  
  // Display profile
  console.log('User Profile:', data.data.profile);
  
  // Display assessment history
  console.log('Total Assessments:', data.data.assessments.count);
  console.log('Recent Scores:', data.data.assessments.sessions.map(a => a.phqScore));
  
  // Display BigQuery analytics
  console.log('Average Score (BigQuery):', data.data.bigQueryAnalytics.averageScore);
  
  // Display personality
  if (data.data.personalityTest) {
    console.log('Personality:', data.data.personalityTest);
  }
}
```

### Example 2: Admin Analytics Dashboard

```javascript
async function loadAdminDashboard(accessToken) {
  // Get comprehensive statistics
  const statsResponse = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-aa629e1b/data/dashboard`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    }
  );
  
  const { statistics } = await statsResponse.json();
  
  // Display Supabase stats
  console.log('Total Users:', statistics.supabase.users);
  console.log('Total Assessments:', statistics.supabase.assessments);
  console.log('Crisis Alerts:', statistics.supabase.crisisAlerts);
  
  // Display BigQuery analytics
  console.log('Average PHQ Score:', statistics.bigQuery.averagePhqScore);
  console.log('Severity Distribution:', statistics.bigQuery.severityDistribution);
  
  // Get trends
  const trendsResponse = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-aa629e1b/data/analytics?timeRange=30d`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    }
  );
  
  const { analytics } = await trendsResponse.json();
  
  // Display trend chart
  console.log('Last 30 Days:', analytics.assessmentTrends);
}
```

### Example 3: Search for User Data

```javascript
async function searchUserData(searchTerm, accessToken) {
  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-aa629e1b/data/search?q=${encodeURIComponent(searchTerm)}&type=all`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    }
  );
  
  const { results } = await response.json();
  
  console.log('Supabase Results:', results.supabase);
  console.log('BigQuery Results:', results.bigQuery);
}
```

### Example 4: Sync Data to BigQuery

```javascript
async function syncDataToBigQuery(userId, accessToken) {
  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-aa629e1b/data/sync`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    }
  );
  
  const { sync } = await response.json();
  
  console.log('Synced Assessments:', sync.assessmentsSynced);
  console.log('Errors:', sync.errors);
}
```

---

## 🎯 Quick Comparison: Before vs After

### Before (Manual Queries)
```javascript
// Step 1: Query Supabase
const { data: userData } = await supabase
  .from('kv_store_aa629e1b')
  .select('*')
  .eq('key', `user:${userId}`);

// Step 2: Query assessments
const { data: assessments } = await supabase
  .from('kv_store_aa629e1b')
  .select('*')
  .like('key', 'assessment:%');

// Step 3: Decrypt each assessment
for (const assessment of assessments) {
  const decrypted = await decrypt(assessment.value.encryptedData);
  // ...
}

// Step 4: Query BigQuery separately
const bigquery = new BigQuery();
const [rows] = await bigquery.query(sql);

// Step 5: Combine everything manually
const combined = { userData, assessments, bigQueryData: rows };
```

### After (Unified API)
```javascript
// ONE call does everything!
const response = await fetch(`/data/user/${userId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

const { data } = await response.json();
// data contains EVERYTHING: profile, assessments (decrypted), BigQuery analytics
```

**From 20+ lines to 5 lines! 🎉**

---

## 📋 Complete Endpoint Reference

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/data/user/:userId` | GET | Get complete user data | Yes |
| `/data/assessment/:sessionId` | GET | Get complete assessment | Yes |
| `/data/dashboard` | GET | Get statistics from both sources | Yes (Admin) |
| `/data/search` | GET | Search both databases | Yes |
| `/data/sync` | POST | Sync Supabase to BigQuery | Yes (Admin) |
| `/data/analytics` | GET | Get trends & analytics | Yes (Admin) |
| `/data/status` | GET | Check connection status | No |
| `/data/query` | GET | Execute custom SQL (BigQuery) | Yes (Admin) |

---

## ✅ Benefits of Unified Access

1. **Simplicity** - One API call instead of multiple queries
2. **Automatic Decryption** - Data is decrypted for you
3. **Combined Results** - Operational data + analytics in one response
4. **No Manual Sync** - Assessments auto-sync to BigQuery
5. **Search** - Find data across both sources
6. **Analytics** - Built-in trending and statistics
7. **Less Code** - Reduce complexity in your frontend

---

## 🚀 Getting Started

### Step 1: Test Connection
```bash
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b/data/status
```

### Step 2: Get Your Access Token
```javascript
const { data: { session } } = await supabase.auth.getSession();
const accessToken = session?.access_token;
```

### Step 3: Fetch Your Data
```bash
curl -X GET \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b/data/user/YOUR_USER_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Step 4: View Dashboard Stats
```bash
curl -X GET \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-aa629e1b/data/dashboard" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🎉 You're All Set!

You now have **unified access** to all your MindLens data!

- ✅ Supabase + BigQuery in one API
- ✅ Automatic decryption
- ✅ Analytics and trends
- ✅ Search capabilities
- ✅ Manual sync option

**Next**: See [DATA_ACCESS_GUIDE.md](DATA_ACCESS_GUIDE.md) for traditional access methods.

---

**Created**: November 22, 2025  
**Status**: ✅ Ready to Use
