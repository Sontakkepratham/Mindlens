# Testing BigQuery Integration

## Quick Test Guide

### 1. Check Backend Health

Open your browser and go to:
```
https://YOUR-PROJECT-ID.supabase.co/functions/v1/make-server-aa629e1b/health
```

You should see:
```json
{
  "status": "healthy",
  "service": "MindLens API",
  "timestamp": "2025-11-17T..."
}
```

### 2. View Server Logs

Check if BigQuery initialized successfully:

```bash
# In Supabase Dashboard → Functions → server → Logs
# Look for these messages:
✅ BigQuery initialized successfully
✅ Table assessment_records created
✅ Table emotion_analysis created
✅ Table user_behavior_patterns created
✅ Table session_outcomes created
```

If you see errors like "BigQuery not initialized", it means:
- `GOOGLE_CLOUD_CREDENTIALS` environment variable is not set
- Or the JSON is malformed
- Or the service account doesn't have proper permissions

### 3. Submit a Test Assessment

Use the MindLens app to:
1. Click "Start Assessment"
2. Toggle "I Provide Consent" → Continue
3. Fill out PHQ-9 questionnaire (any responses)
4. Complete face scan
5. View results

**Check the backend logs** - you should see:
```
🤖 Processing face scan with Vertex AI
✅ Assessment record inserted to BigQuery: MS-...
✅ Emotion analysis inserted to BigQuery
✅ User behavior pattern updated
```

### 4. Verify Data in BigQuery Console

1. Go to https://console.cloud.google.com/bigquery
2. Select your project: `mindlens-production`
3. Expand `mindlens_ml_training` dataset
4. Click `assessment_records` table
5. Click "Preview" to see data

**Sample Query:**
```sql
SELECT 
  assessment_id,
  timestamp,
  phq9_total_score,
  severity_level
FROM `mindlens-production.mindlens_ml_training.assessment_records`
ORDER BY timestamp DESC
LIMIT 10;
```

### 5. Access ML Dashboard in App

1. On the onboarding screen, click:
   **"🧠 Admin: View ML Training Dashboard"**

2. You should see:
   - Total assessments count
   - Average PHQ-9 score
   - Severity distribution graph
   - Emotion distribution
   - Active BigQuery tables
   - ML model status

### 6. Test ML Endpoints Directly

#### Get Training Data
```bash
curl https://YOUR-PROJECT-ID.supabase.co/functions/v1/make-server-aa629e1b/ml/training-data?limit=100
```

#### Get Feature Statistics
```bash
curl https://YOUR-PROJECT-ID.supabase.co/functions/v1/make-server-aa629e1b/ml/feature-statistics
```

#### Export for AI Training
```bash
curl -X POST https://YOUR-PROJECT-ID.supabase.co/functions/v1/make-server-aa629e1b/ml/export-for-ai-training
```

---

## Troubleshooting

### Error: "BigQuery not initialized"

**Solution:**
1. Make sure you uploaded the Google Cloud service account JSON
2. Verify the JSON is valid (copy-paste the entire file contents)
3. Check service account has these roles:
   - BigQuery Data Editor
   - BigQuery Job User

### Error: "Permission denied"

**Solution:**
```bash
# Grant proper roles to service account
gcloud projects add-iam-policy-binding mindlens-production \
  --member="serviceAccount:mindlens-backend-service@mindlens-production.iam.gserviceaccount.com" \
  --role="roles/bigquery.dataEditor"

gcloud projects add-iam-policy-binding mindlens-production \
  --member="serviceAccount:mindlens-backend-service@mindlens-production.iam.gserviceaccount.com" \
  --role="roles/bigquery.jobUser"
```

### Tables Not Created

**Solution:**
1. Check server startup logs
2. Manually trigger initialization by hitting the health endpoint
3. Or deploy the function again:
```bash
supabase functions deploy server
```

### No Data Appearing in BigQuery

**Checklist:**
- [ ] User gave consent (toggle "I Provide Consent")
- [ ] Assessment was submitted successfully
- [ ] No errors in server logs
- [ ] Service account has write permissions
- [ ] Project ID in code matches your GCP project

---

## Verify End-to-End Data Flow

### Complete Flow Test:

1. **User Registration** (optional for testing)
   ```bash
   curl -X POST https://YOUR-PROJECT.supabase.co/functions/v1/make-server-aa629e1b/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
   ```

2. **Submit Assessment**
   - Use the app to complete PHQ-9
   - Check logs: `✅ Assessment record inserted to BigQuery`

3. **Query BigQuery**
   ```sql
   SELECT COUNT(*) as total_assessments
   FROM `mindlens-production.mindlens_ml_training.assessment_records`;
   ```

4. **View in ML Dashboard**
   - Total count should match BigQuery count
   - Severity distribution should be accurate

---

## Data Pipeline Verification

Your data flows like this:

```
User submits PHQ-9
    ↓
Frontend → Backend API
    ↓
Backend processes:
  1. ✅ Store in Supabase KV (encrypted backup)
  2. ✅ Hash user ID (SHA-256)
  3. ✅ Insert to BigQuery assessment_records table
  4. ✅ Insert to BigQuery emotion_analysis table
  5. ✅ Update user_behavior_patterns table
    ↓
Data now available for ML training
```

**Verify each step:**
- [x] Supabase KV: Check `kv.get('assessment:SESSION_ID')`
- [x] BigQuery: Query `assessment_records` table
- [x] Privacy: User ID is hashed, not raw ID
- [x] Consent: Only records with `consent_research = TRUE`

---

## Expected Data Structure

### In BigQuery `assessment_records`:

| Column | Example Value |
|--------|---------------|
| assessment_id | MS-1700234567890-a3f8e2b |
| user_hash | a3f8e2b4c5d6... (SHA-256) |
| timestamp | 2025-11-17 14:30:00 UTC |
| phq9_q1 | 2 |
| phq9_q2 | 3 |
| ... | ... |
| phq9_q9 | 1 |
| phq9_total_score | 15 |
| severity_level | moderate |
| requires_immediate_action | false |
| consent_research | true |

---

## Next Steps After Verification

Once data is flowing to BigQuery:

1. ✅ **Accumulate Training Data**
   - Aim for 1,000+ samples for decent ML model
   - 10,000+ samples for production-grade model

2. ✅ **Export for Training**
   ```bash
   # Via API
   POST /ml/export-for-ai-training
   
   # Or via BigQuery export
   bq extract \
     mindlens_ml_training.assessment_records \
     gs://mindlens-ml-training/exports/data.jsonl
   ```

3. ✅ **Train ML Models**
   - Use Vertex AI AutoML (no code)
   - Or custom training with TensorFlow/PyTorch
   - Or fine-tune Gemini/PaLM models

4. ✅ **Deploy Trained Models**
   - Deploy to Vertex AI endpoint
   - Integrate predictions into app
   - Monitor model performance

---

## Success Criteria

Your BigQuery integration is working if:

- [x] Backend health check returns "healthy"
- [x] Server logs show "BigQuery initialized successfully"
- [x] Assessments insert without errors
- [x] Data appears in BigQuery console
- [x] ML Dashboard shows accurate statistics
- [x] User IDs are hashed (privacy protected)
- [x] Only consented data is stored

---

## Support

If you're stuck, check:
1. Server logs in Supabase Dashboard
2. BigQuery job history (shows failed inserts)
3. Service account permissions in GCP IAM
4. Environment variables are set correctly

**Common Issues:**
- Wrong project ID in code vs GCP
- Service account JSON malformed
- Missing IAM permissions
- Dataset/table name mismatch

---

**Last Updated:** November 17, 2025
