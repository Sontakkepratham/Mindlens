# MindLens - Clinical Mental Health Screening Platform
## System Architecture Documentation

---

## Overview

MindLens is an end-to-end encrypted, HIPAA-compliant mental health screening platform that integrates:
- **Frontend**: React + TypeScript mobile-first UI
- **Backend**: Supabase Edge Functions (Hono web server)
- **Database**: Supabase PostgreSQL with KV Store
- **Cloud Infrastructure**: Google Cloud Platform
- **AI/ML**: Vertex AI for emotion analysis
- **Analytics**: BigQuery for de-identified research data

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │Onboarding│  │ PHQ-9    │  │Face Scan │  │ Results  │        │
│  │ Screen   │→ │Assessment│→ │ Screen   │→ │ Screen   │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                          ↓                                       │
│                   [API Client Layer]                             │
│                  (AES-256 Encryption)                            │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS (TLS 1.3)
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│              SUPABASE BACKEND (Edge Functions)                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Hono Web Server (/make-server-aa629e1b/)             │     │
│  │                                                         │     │
│  │  Routes:                                                │     │
│  │  • POST /auth/signup          - User registration      │     │
│  │  • POST /assessment/submit    - PHQ-9 + Face Scan     │     │
│  │  • GET  /counselors/recommendations - ML matching      │     │
│  │  • POST /sessions/book        - Encrypted booking      │     │
│  │  • POST /ai/analyze-face      - Vertex AI proxy       │     │
│  │  • POST /emergency/trigger    - Crisis response       │     │
│  └────────────────────────────────────────────────────────┘     │
│                          ↓                                       │
│  ┌────────────────────────────────────────────────────────┐     │
│  │         Supabase PostgreSQL (KV Store)                 │     │
│  │  • user:{id} - User profiles                           │     │
│  │  • assessment:{sessionId} - Encrypted assessments      │     │
│  │  • booking:{id} - Session bookings                     │     │
│  │  • crisis-alert:{id} - Emergency alerts                │     │
│  │  • research:{id} - De-identified data                  │     │
│  └────────────────────────────────────────────────────────┘     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│              GOOGLE CLOUD PLATFORM (GCP)                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  Cloud Storage (Encrypted at Rest)                   │       │
│  │  gs://mindlens-encrypted-data/                       │       │
│  │  • /assessments/{sessionId}/data.enc                 │       │
│  │  • /face-scans/{sessionId}/scan.enc                  │       │
│  │  • Customer-managed encryption keys (CMEK)           │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  Vertex AI (Machine Learning)                        │       │
│  │  projects/mindlens-production/locations/us-central1   │       │
│  │                                                       │       │
│  │  • emotion-analysis-v2 - Facial emotion detection    │       │
│  │  • risk-assessment-v1  - Suicide risk prediction     │       │
│  │  • Processing in isolated environment                │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  BigQuery (Analytics)                                │       │
│  │  mindlens-production.mindlens_analytics              │       │
│  │                                                       │       │
│  │  • assessment_results - De-identified research data  │       │
│  │  • All PII removed                                   │       │
│  │  • Aggregated statistics only                        │       │
│  └──────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. User Registration
```
User → Frontend → POST /auth/signup → Supabase Auth → KV Store
                                     ↓
                              Access Token (JWT)
```

### 2. PHQ-9 Assessment Flow
```
User fills PHQ-9 
    ↓
Frontend encrypts responses (AES-256)
    ↓
POST /assessment/submit
    ↓
Backend processes:
  1. Calculate PHQ-9 score
  2. Check crisis indicators (Q9 >= 2 or score >= 20)
  3. Store encrypted in KV Store
  4. Upload encrypted to Cloud Storage
  5. If consent: store de-identified in BigQuery
  6. If crisis: trigger emergency alert
    ↓
Return results to frontend
```

### 3. Face Scan Flow
```
User captures photo
    ↓
Frontend converts to base64
    ↓
POST /ai/analyze-face
    ↓
Backend → Vertex AI Prediction API
    ↓
Emotion analysis (primary, secondary, confidence)
    ↓
Encrypted storage in Cloud Storage
    ↓
Return analysis to frontend
```

### 4. Counselor Booking Flow
```
User selects counselor
    ↓
POST /sessions/book
    ↓
Backend creates:
  1. Booking record (encrypted)
  2. Secure meeting link (unique token)
  3. Session number
    ↓
Store in KV Store
    ↓
Return booking confirmation
```

### 5. Crisis Detection Flow
```
Assessment submitted
    ↓
Backend analyzes:
  • PHQ-9 Q9 (self-harm) >= 2
  • Total score >= 20
  • Multiple severity 3 responses
    ↓
If crisis detected:
  1. Create crisis alert
  2. Notify on-call counselor
  3. Display emergency resources (988, 741741)
  4. Log to secure audit trail
  5. Flag for immediate follow-up
```

---

## Security & Encryption

### End-to-End Encryption
```typescript
// Frontend: Web Crypto API
const key = await crypto.subtle.generateKey(
  { name: 'AES-GCM', length: 256 },
  true,
  ['encrypt', 'decrypt']
);

const encrypted = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv: randomIV },
  key,
  data
);
```

### Data at Rest
- **Cloud Storage**: Customer-managed encryption keys (CMEK)
- **Database**: Supabase PostgreSQL encryption
- **Backups**: Encrypted with AES-256

### Data in Transit
- **TLS 1.3**: All API communications
- **Certificate Pinning**: Mobile app (future)
- **JWT Tokens**: Signed with HS256

### HIPAA Compliance Measures
1. **Access Control**: Role-based authentication
2. **Audit Logging**: All PHI access logged
3. **Data Minimization**: Only collect necessary data
4. **De-identification**: Research data stripped of PII
5. **Secure Disposal**: Encrypted deletion protocols

---

## Database Schema (KV Store)

### User Records
```typescript
key: `user:{userId}`
value: {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}
```

### Assessment Records
```typescript
key: `assessment:{sessionId}`
value: {
  userId: string;
  sessionId: string;
  timestamp: string;
  phqResponses: number[];
  phqScore: number;
  emotionAnalysis: {
    primaryEmotion: string;
    secondaryMarkers: string;
    confidence: number;
    vertexAiModelVersion: string;
  };
  encrypted: true;
  requiresImmediateAction: boolean;
  consentToResearch: boolean;
}
```

### Booking Records
```typescript
key: `booking:{bookingId}`
value: {
  bookingId: string;
  sessionNumber: string;
  userId: string;
  counselorId: string;
  scheduledDate: string;
  scheduledTime: string;
  meetingLink: string; // Encrypted token
  status: 'confirmed' | 'cancelled' | 'completed';
  encrypted: true;
  createdAt: string;
}
```

### Crisis Alert Records
```typescript
key: `crisis-alert:{alertId}`
value: {
  alertId: string;
  userId: string;
  sessionId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  actionTaken: string;
  escalated: boolean;
}
```

### Research Data (De-identified)
```typescript
key: `research:{sessionId}`
value: {
  sessionId: string; // Random, not linked to user
  timestamp: string;
  phqScore: number;
  severityLevel: 'minimal' | 'mild' | 'moderate' | 'severe';
  primaryEmotion: string;
  // NO userId or PII
}
```

---

## Google Cloud Integration

### Cloud Storage Setup
```bash
# Create encrypted bucket
gsutil mb -p mindlens-production \
  -c STANDARD \
  -l us-central1 \
  gs://mindlens-encrypted-data/

# Enable customer-managed encryption
gcloud kms keyrings create mindlens-keyring \
  --location=us-central1

gcloud kms keys create assessment-encryption-key \
  --location=us-central1 \
  --keyring=mindlens-keyring \
  --purpose=encryption
```

### Vertex AI Model Deployment
```bash
# Deploy emotion analysis model
gcloud ai endpoints create \
  --region=us-central1 \
  --display-name=emotion-analysis-v2

gcloud ai models upload \
  --region=us-central1 \
  --display-name=emotion-detector \
  --container-image-uri=gcr.io/mindlens/emotion-model:v2.1.0 \
  --endpoint=emotion-analysis-v2
```

### BigQuery Dataset
```sql
CREATE SCHEMA mindlens_analytics
OPTIONS(
  location="us-central1",
  default_table_expiration_days=365
);

CREATE TABLE mindlens_analytics.assessment_results (
  session_id STRING NOT NULL,
  assessment_date TIMESTAMP NOT NULL,
  phq_score INT64,
  severity_level STRING,
  primary_emotion STRING,
  consent_research BOOL,
  -- NO user_id or PII columns
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY DATE(assessment_date)
CLUSTER BY severity_level;
```

---

## Safety Features

### Crisis Detection Rules
1. **Immediate Action Required**:
   - PHQ-9 Question 9 score >= 2 (self-harm thoughts)
   - Total PHQ-9 score >= 20 (severe depression)

2. **High Risk**:
   - Total score >= 15
   - Multiple responses of 3 (nearly every day)

3. **Actions Taken**:
   - Display 988 hotline immediately
   - Alert on-call crisis counselor
   - Create audit log
   - Send emergency resources

### Session Monitoring
- Real-time transcript analysis (keyword detection)
- Emotional state tracking during video sessions
- Automated safety check-ins
- Counselor alert system

### Emergency Protocols
```typescript
Emergency Hotlines:
- 988: Suicide & Crisis Lifeline (24/7)
- 741741: Crisis Text Line (text HOME)
- 911: Emergency services
- 988 Press 1: Veterans Crisis Line
```

---

## API Endpoints Reference

### Authentication
- `POST /auth/signup` - Create new user account
- Supabase handles: sign-in, sign-out, session management

### Assessment
- `POST /assessment/submit` - Submit PHQ-9 + face scan
- Returns: sessionId, phqScore, emotionAnalysis, crisis flags

### Counselors
- `GET /counselors/recommendations?phqScore={score}` - Get matched counselors

### Sessions
- `POST /sessions/book` - Book encrypted counseling session

### AI/ML
- `POST /ai/analyze-face` - Vertex AI emotion analysis

### Analytics
- `GET /analytics/aggregate` - BigQuery aggregated stats (admin only)

### Emergency
- `POST /emergency/trigger` - Trigger crisis alert

### Health
- `GET /health` - API health check

---

## Deployment Checklist

### Frontend
- [ ] Build React app: `npm run build`
- [ ] Configure environment variables
- [ ] Deploy to CDN / hosting

### Backend (Supabase)
- [x] Edge functions deployed
- [ ] Environment variables set:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SUPABASE_ANON_KEY`

### Google Cloud
- [ ] Create GCP project: `mindlens-production`
- [ ] Enable APIs:
  - Cloud Storage API
  - Vertex AI API
  - BigQuery API
- [ ] Set up service account with permissions
- [ ] Configure CMEK encryption keys
- [ ] Deploy Vertex AI models
- [ ] Create BigQuery dataset

### Security
- [ ] Enable 2FA for all admin accounts
- [ ] Configure IP allowlists
- [ ] Set up monitoring alerts
- [ ] Enable audit logging
- [ ] Run security audit
- [ ] HIPAA compliance review

### Compliance
- [ ] Sign BAA (Business Associate Agreement) with Google Cloud
- [ ] Configure data retention policies
- [ ] Set up backup and disaster recovery
- [ ] Document security procedures
- [ ] Train staff on PHI handling

---

## Monitoring & Observability

### Logs
- Supabase Edge Functions: Console logs
- GCP Cloud Logging: All API calls
- BigQuery: Query audit logs

### Metrics
- Assessment completion rate
- Crisis alert frequency
- Vertex AI latency
- API response times
- Error rates

### Alerts
- Crisis alerts → PagerDuty
- API errors → Email
- High latency → Slack
- Failed deployments → SMS

---

## Cost Estimates (Monthly)

### Supabase
- Free tier: 500MB database, 2GB bandwidth
- Pro: $25/month for production

### Google Cloud
- Cloud Storage: ~$20/month (10GB encrypted data)
- Vertex AI: ~$100/month (1000 predictions)
- BigQuery: ~$30/month (100GB data, 1TB queries)

**Total: ~$175/month** for 1,000 users

---

## Development Setup

```bash
# Clone repository
git clone <repo-url>

# Install dependencies
npm install

# Set environment variables
cp .env.example .env

# Run locally
npm run dev

# Deploy backend
supabase functions deploy server
```

---

## Production Considerations

### Scaling
- Use Supabase connection pooling
- Implement Redis caching
- CDN for static assets
- Vertex AI batch predictions for cost optimization

### Compliance
- **IMPORTANT**: Figma Make is for prototyping only. Do NOT collect real PHI (Protected Health Information) in this environment.
- For production: Migrate to dedicated HIPAA-compliant infrastructure
- Sign BAAs with all service providers
- Implement full audit trail
- Regular security audits

### Privacy
- Users can delete all data on request
- Data retention: 7 years (HIPAA requirement)
- Anonymous analytics only
- Opt-in for research data

---

## Support & Resources

- **Emergency**: 988 (Suicide & Crisis Lifeline)
- **Documentation**: [Internal Wiki]
- **On-call**: [PagerDuty rotation]
- **Security**: security@mindlens.health

---

**Last Updated**: November 17, 2025  
**Version**: 1.0.0  
**Maintained by**: MindLens Engineering Team
