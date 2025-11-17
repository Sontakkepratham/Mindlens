# BigQuery Integration Setup Guide
## MindLens ML Training Data Pipeline

---

## Overview

This guide explains how to connect MindLens to Google BigQuery so that all assessment data is automatically stored for machine learning model training and AI agent learning.

---

## Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Create a new project** called `mindlens-production`
3. **Note your Project ID** (might be different from project name)

---

## Step 2: Enable Required APIs

Enable these APIs in your GCP project:

```bash
# Using gcloud CLI
gcloud services enable bigquery.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable aiplatform.googleapis.com
```

Or enable via Console:
- BigQuery API
- Cloud Storage API  
- Vertex AI API

---

## Step 3: Create Service Account

1. **Navigate to**: IAM & Admin → Service Accounts
2. **Create Service Account**:
   - Name: `mindlens-backend-service`
   - Description: "MindLens backend API service account"
   
3. **Grant Roles**:
   - BigQuery Data Editor
   - BigQuery Job User
   - Storage Object Creator
   - Vertex AI User

4. **Create JSON Key**:
   - Click on the service account
   - Go to "Keys" tab
   - Add Key → Create New Key → JSON
   - **Download the JSON file** (keep it secure!)

---

## Step 4: Upload Service Account to Supabase

You've already been prompted to upload your `GOOGLE_CLOUD_CREDENTIALS`. 

The JSON file should look like this:

```json
{
  "type": "service_account",
  "project_id": "mindlens-production",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "mindlens-backend-service@mindlens-production.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

**Paste the entire JSON file contents** into the environment variable.

---

## Step 5: BigQuery Tables Created Automatically

When your backend starts, it will automatically create these tables:

### 1. `assessment_records`
Stores every PHQ-9 assessment for ML training.

**Schema:**
```sql
CREATE TABLE mindlens_ml_training.assessment_records (
  assessment_id STRING NOT NULL,
  user_hash STRING NOT NULL,        -- SHA-256 hash (not raw user ID)
  timestamp TIMESTAMP NOT NULL,
  phq9_q1 INT64 NOT NULL,           -- Question 1 response (0-3)
  phq9_q2 INT64 NOT NULL,           -- Question 2 response
  phq9_q3 INT64 NOT NULL,
  phq9_q4 INT64 NOT NULL,
  phq9_q5 INT64 NOT NULL,
  phq9_q6 INT64 NOT NULL,
  phq9_q7 INT64 NOT NULL,
  phq9_q8 INT64 NOT NULL,
  phq9_q9 INT64 NOT NULL,           -- Self-harm question
  phq9_total_score INT64 NOT NULL,
  severity_level STRING NOT NULL,    -- minimal, mild, moderate, severe
  requires_immediate_action BOOLEAN NOT NULL,
  age_range STRING,                  -- Optional demographics
  gender STRING,
  timezone STRING,
  consent_research BOOLEAN NOT NULL  -- Only true if user consented
)
PARTITION BY DATE(timestamp)
CLUSTER BY severity_level, user_hash;
```

### 2. `emotion_analysis`
Stores facial emotion detection results from Vertex AI.

**Schema:**
```sql
CREATE TABLE mindlens_ml_training.emotion_analysis (
  analysis_id STRING NOT NULL,
  assessment_id STRING NOT NULL,
  user_hash STRING NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  primary_emotion STRING NOT NULL,   -- neutral, sadness, anxiety, etc.
  secondary_emotion STRING,
  confidence_score FLOAT64 NOT NULL,
  facial_landmarks_detected BOOLEAN NOT NULL,
  sadness_score FLOAT64,            -- Individual emotion scores
  anxiety_score FLOAT64,
  neutral_score FLOAT64,
  happiness_score FLOAT64,
  anger_score FLOAT64,
  fear_score FLOAT64,
  vertex_ai_model_version STRING NOT NULL
)
PARTITION BY DATE(timestamp);
```

### 3. `user_behavior_patterns`
Tracks how user behavior correlates with outcomes.

**Schema:**
```sql
CREATE TABLE mindlens_ml_training.user_behavior_patterns (
  behavior_id STRING NOT NULL,
  user_hash STRING NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  assessment_count INT64 NOT NULL,
  days_between_assessments INT64,
  score_trend STRING,               -- improving, declining, stable
  engagement_level STRING,          -- high, medium, low
  session_count INT64,
  last_session_days_ago INT64,
  crisis_alerts_count INT64
)
PARTITION BY DATE(timestamp);
```

### 4. `session_outcomes`
Tracks counseling session effectiveness.

**Schema:**
```sql
CREATE TABLE mindlens_ml_training.session_outcomes (
  session_id STRING NOT NULL,
  user_hash STRING NOT NULL,
  counselor_hash STRING NOT NULL,
  session_date TIMESTAMP NOT NULL,
  pre_session_phq9 INT64,
  post_session_phq9 INT64,
  score_improvement INT64,          -- Difference (positive = improvement)
  session_duration_minutes INT64,
  user_satisfaction_rating INT64,   -- 1-5 stars
  follow_up_scheduled BOOLEAN
)
PARTITION BY DATE(session_date);
```

---

## Step 6: Data Flow

Every time a user submits an assessment, data automatically flows to BigQuery:

```
User completes PHQ-9
    ↓
Frontend sends to backend
    ↓
Backend processes assessment
    ↓
Supabase KV Store (encrypted backup)
    ↓
BigQuery Insert (pseudonymized)
    ↓
Data available for ML training
```

---

## Step 7: Access ML Training Data

### Via API Endpoints

Your backend now has these ML endpoints:

#### Get Training Dataset
```bash
GET /make-server-aa629e1b/ml/training-data?limit=10000

Response:
{
  "success": true,
  "dataset": [
    {
      "user_hash": "a3f8e2b...",
      "phq9_q1": 2,
      "phq9_q2": 3,
      ...
      "phq9_total_score": 15,
      "severity_level": "moderate",
      "primary_emotion": "sadness",
      "confidence_score": 0.82
    }
  ],
  "count": 1247,
  "features": ["phq9_q1", "phq9_q2", ..., "primary_emotion"],
  "target_labels": ["severity_level", "requires_immediate_action"]
}
```

#### Export for AI Training
```bash
POST /make-server-aa629e1b/ml/export-for-ai-training

Response:
{
  "success": true,
  "exportUri": "gs://mindlens-ml-training/exports/training-data-1700234567890.jsonl",
  "nextSteps": [
    "1. Data is now in Cloud Storage as JSONL",
    "2. Use Vertex AI AutoML to train custom models",
    "3. Deploy trained model to Vertex AI endpoint"
  ]
}
```

#### Get Feature Statistics
```bash
GET /make-server-aa629e1b/ml/feature-statistics

Response:
{
  "success": true,
  "statistics": {
    "total_samples": 1247,
    "severity_distribution": {...},
    "emotion_distribution": {...},
    "phq9_correlations": {...}
  }
}
```

---

## Step 8: Query BigQuery Directly

You can also query BigQuery directly from GCP console:

### Example: Get all moderate-to-severe cases
```sql
SELECT 
  phq9_q1, phq9_q2, phq9_q3, phq9_q4, phq9_q5,
  phq9_q6, phq9_q7, phq9_q8, phq9_q9,
  phq9_total_score,
  primary_emotion,
  confidence_score
FROM `mindlens-production.mindlens_ml_training.assessment_records` a
LEFT JOIN `mindlens-production.mindlens_ml_training.emotion_analysis` e
  ON a.assessment_id = e.assessment_id
WHERE phq9_total_score >= 10
  AND consent_research = TRUE
ORDER BY timestamp DESC
LIMIT 1000;
```

### Example: Track user improvement over time
```sql
SELECT 
  user_hash,
  DATE(timestamp) as assessment_date,
  phq9_total_score,
  LAG(phq9_total_score) OVER (PARTITION BY user_hash ORDER BY timestamp) as previous_score,
  phq9_total_score - LAG(phq9_total_score) OVER (PARTITION BY user_hash ORDER BY timestamp) as change
FROM `mindlens-production.mindlens_ml_training.assessment_records`
WHERE consent_research = TRUE
ORDER BY user_hash, timestamp;
```

### Example: Emotion-PHQ correlation
```sql
SELECT 
  e.primary_emotion,
  AVG(a.phq9_total_score) as avg_phq_score,
  COUNT(*) as sample_count,
  STDDEV(a.phq9_total_score) as score_stddev
FROM `mindlens-production.mindlens_ml_training.assessment_records` a
JOIN `mindlens-production.mindlens_ml_training.emotion_analysis` e
  ON a.assessment_id = e.assessment_id
WHERE consent_research = TRUE
GROUP BY e.primary_emotion
ORDER BY avg_phq_score DESC;
```

---

## Step 9: Train ML Models with Vertex AI

### Option 1: AutoML (No Code)

```bash
# Export data to Cloud Storage
bq extract \
  --destination_format=CSV \
  mindlens_ml_training.assessment_records \
  gs://mindlens-ml-training/automl/data.csv

# Create AutoML dataset
gcloud ai datasets create \
  --region=us-central1 \
  --display-name=mindlens-phq9-dataset \
  --schema=csv

# Train AutoML model
gcloud ai custom-jobs create \
  --region=us-central1 \
  --display-name=depression-severity-classifier \
  --worker-pool-spec=machine-type=n1-standard-4,replica-count=1
```

### Option 2: Custom Training (Python)

```python
from google.cloud import bigquery
from google.cloud import aiplatform
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

# Query training data
client = bigquery.Client()
query = """
SELECT * FROM `mindlens-production.mindlens_ml_training.assessment_records`
WHERE consent_research = TRUE
"""
df = client.query(query).to_dataframe()

# Prepare features
features = ['phq9_q1', 'phq9_q2', 'phq9_q3', 'phq9_q4', 'phq9_q5',
            'phq9_q6', 'phq9_q7', 'phq9_q8', 'phq9_q9']
X = df[features]
y = df['severity_level']

# Train model
model = RandomForestClassifier(n_estimators=100)
model.fit(X, y)

# Deploy to Vertex AI
aiplatform.init(project='mindlens-production', location='us-central1')
model_upload = aiplatform.Model.upload(
    display_name='phq9-severity-classifier',
    artifact_uri='gs://mindlens-models/rf-v1',
    serving_container_image_uri='us-docker.pkg.dev/vertex-ai/prediction/sklearn-cpu.0-24:latest'
)
endpoint = model_upload.deploy(machine_type='n1-standard-4')
```

---

## Step 10: AI Agent Learning

For AI agents to learn user patterns:

### Longitudinal Analysis Query
```sql
WITH user_timeline AS (
  SELECT 
    user_hash,
    timestamp,
    phq9_total_score,
    ROW_NUMBER() OVER (PARTITION BY user_hash ORDER BY timestamp) as assessment_number
  FROM `mindlens-production.mindlens_ml_training.assessment_records`
  WHERE consent_research = TRUE
)
SELECT 
  user_hash,
  ARRAY_AGG(phq9_total_score ORDER BY timestamp) as score_progression,
  MAX(phq9_total_score) - MIN(phq9_total_score) as total_change,
  CASE 
    WHEN MAX(phq9_total_score) - MIN(phq9_total_score) < -5 THEN 'significant_improvement'
    WHEN MAX(phq9_total_score) - MIN(phq9_total_score) < -2 THEN 'improvement'
    WHEN MAX(phq9_total_score) - MIN(phq9_total_score) > 5 THEN 'significant_decline'
    WHEN MAX(phq9_total_score) - MIN(phq9_total_score) > 2 THEN 'decline'
    ELSE 'stable'
  END as trend
FROM user_timeline
WHERE assessment_number >= 3  -- At least 3 assessments
GROUP BY user_hash;
```

---

## Privacy & Security

### ✅ What's Protected

1. **User IDs are hashed** with SHA-256 + salt
2. **No PII stored** in BigQuery (no names, emails, addresses)
3. **Only consented data** is stored (`consent_research = TRUE`)
4. **Encrypted in transit** (TLS 1.3) and at rest
5. **Access controlled** via IAM roles

### ⚠️ Important Compliance Notes

- **HIPAA Compliance**: Sign BAA with Google Cloud
- **Data Retention**: Configure automatic deletion after 7 years
- **User Rights**: Allow users to request data deletion
- **Audit Logs**: Enable BigQuery audit logging
- **Regular Reviews**: Audit data access quarterly

---

## Monitoring & Costs

### Monitor BigQuery Usage

```bash
# View storage size
bq show --format=prettyjson mindlens_ml_training

# View query costs
gcloud logging read "resource.type=bigquery_resource" \
  --limit 50 \
  --format json
```

### Cost Estimates

- **Storage**: $0.02/GB/month (~$2/month for 100GB)
- **Queries**: $5/TB scanned (~$10/month for ML training)
- **Streaming Inserts**: $0.05 per 200MB (~$5/month for 10K assessments)

**Total: ~$17/month for 10,000 users**

---

## Troubleshooting

### Error: "BigQuery not initialized"

**Solution**: Make sure `GOOGLE_CLOUD_CREDENTIALS` is set correctly. Check logs:
```bash
supabase functions logs server
```

### Error: "Permission denied"

**Solution**: Verify service account has these roles:
- BigQuery Data Editor
- BigQuery Job User

### Tables not created

**Solution**: Manually run initialization:
```bash
curl https://YOUR-PROJECT.supabase.co/functions/v1/make-server-aa629e1b/health
```

Check server logs for errors.

---

## Next Steps

1. ✅ Upload Google Cloud service account JSON
2. ⬜ Verify tables are created in BigQuery
3. ⬜ Submit test assessment to see data flow
4. ⬜ Query BigQuery to see data
5. ⬜ Export training data for ML models
6. ⬜ Train first ML model with Vertex AI
7. ⬜ Deploy model and integrate predictions

---

## Support

**Questions?** Check these resources:
- [BigQuery Documentation](https://cloud.google.com/bigquery/docs)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

---

**Last Updated**: November 17, 2025  
**Version**: 1.0.0
