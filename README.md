
  # Mindlens

  This is a code bundle for Mindlens. The original project is available at https://www.figma.com/design/w9KM1zXSDQSIoafFfW6DDu/Mindlens & webhook https://lillbeen.github.io/.
# 🧠 MindLens - Clinical Mental Health Screening Platform

A production-ready mental health assessment application combining PHQ-9 questionnaires with AI-powered facial emotion analysis. Built with React, TypeScript, Tailwind CSS, and integrated with Google Cloud Platform for ML training.

![MindLens Banner](https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=400&fit=crop)

## ✨ Features

### Core Assessment Features
- ✅ **PHQ-9 Mental Health Questionnaire** - Clinically validated depression screening
- ✅ **AI-Powered Face Scanning** - Emotion detection using facial analysis
- ✅ **Severity Assessment** - Automated risk level classification
- ✅ **Counselor Recommendations** - Personalized mental health professional matching
- ✅ **Appointment Booking** - Integrated session scheduling
- ✅ **Crisis Detection** - Emergency protocol activation for high-risk cases

### Security & Compliance
- 🔒 **End-to-End Encryption** - AES-256-GCM encryption for all sensitive data
- 🔒 **HIPAA-Compliant Storage** - Secure data handling with Supabase
- 🔒 **Pseudonymization** - SHA-256 hashed user identifiers
- 🔒 **Informed Consent** - Explicit consent collection for data usage

### ML & Analytics (Optional)
- 🤖 **BigQuery Integration** - Store assessment data for ML training
- 🤖 **Training Data Pipeline** - Automated data collection for AI models
- 🤖 **ML Dashboard** - Real-time analytics and model performance metrics
- 🤖 **Vertex AI Ready** - Export-ready format for Google Cloud AI training

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- A Supabase account
- (Optional) Google Cloud Platform account for ML features

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/mindlens.git
cd mindlens
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Supabase**
   - The app auto-configures with Figma Make's Supabase integration
   - Environment variables are set automatically
   - See `/utils/supabase/info.tsx` for connection details

4. **Run the app**
```bash
npm run dev
```

5. **Start using!**
   - Open http://localhost:3000
   - Dismiss the setup modal
   - Click "Start Assessment"

## 📋 Application Flow

```
1. Onboarding Screen
   ↓
2. Consent & Privacy Agreement
   ↓
3. PHQ-9 Questionnaire (9 questions)
   ↓
4. AI Face Scanning
   ↓
5. Results & Severity Analysis
   ↓
6. Counselor Recommendations
   ↓
7. Booking Confirmation
```

## 🎨 Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: shadcn/ui
- **Backend**: Supabase Edge Functions (Hono)
- **Database**: Supabase PostgreSQL + KV Store
- **ML Storage**: Google BigQuery (optional)
- **AI**: Google Cloud Vertex AI ready
- **Encryption**: Web Crypto API (AES-256-GCM)

## 🔧 Configuration

### BigQuery Setup (Optional)

BigQuery integration is **completely optional**. The app works perfectly without it!

#### Why use BigQuery?
- Train ML models on large assessment datasets
- Advanced analytics and insights
- Export data to Vertex AI for model training

#### How to enable:

1. **Get Google Cloud credentials**
   ```bash
   # Visit Google Cloud Console
   https://console.cloud.google.com/iam-admin/serviceaccounts
   
   # Create service account with roles:
   - BigQuery Data Editor
   - BigQuery Job User
   - Storage Object Creator (optional)
   ```

2. **Download JSON key file**

3. **Validate the JSON**
   - In the app, click "🔧 Configure BigQuery"
   - Paste your JSON
   - Wait for ✅ "Valid JSON - Ready to upload!"

4. **Upload to Supabase**
   - Go to Supabase Dashboard → Settings → Edge Functions → Secrets
   - Create secret: `GOOGLE_CLOUD_CREDENTIALS`
   - Paste the raw JSON content
   - Redeploy the server function

5. **Verify**
   - Backend logs should show: `✅ BigQuery credentials loaded`

📖 **Detailed guide**: See `/CREDENTIALS_FIX_GUIDE.md`

## 📁 Project Structure

```
mindlens/
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── OnboardingScreen.tsx
│   ├── ConsentScreen.tsx
│   ├── QuestionnaireScreen.tsx
│   ├── FaceScanScreen.tsx
│   ├── ResultsScreen.tsx
│   ├── RecommendationsScreen.tsx
│   ├── BookingConfirmationScreen.tsx
│   ├── MLDashboardScreen.tsx
│   ├── SystemTestScreen.tsx
│   └── CredentialsUploadScreen.tsx
├── lib/                 # Utilities
│   ├── api-client.ts   # Backend API client
│   └── encryption.ts   # AES-256 encryption
├── supabase/functions/server/
│   ├── index.tsx       # Main server (Hono)
│   ├── bigquery-service.tsx
│   ├── ml-endpoints.tsx
│   └── kv_store.tsx
├── styles/
│   └── globals.css     # Tailwind + typography
├── App.tsx             # Main app component
└── README.md
```

## 🔐 Security Features

### Data Encryption
- **Algorithm**: AES-256-GCM
- **Key Management**: Web Crypto API
- **Scope**: PHQ-9 responses, emotion data, personal info

### Privacy Measures
- SHA-256 hashed user IDs (no PII)
- Explicit consent before data collection
- Pseudonymized data in BigQuery
- HIPAA-compliant storage architecture

### Crisis Detection
- Automatic detection of high-risk scores (PHQ-9 ≥ 20)
- Question 9 monitoring (suicidal ideation)
- Emergency contact protocols
- Immediate intervention recommendations

## 📊 ML Dashboard

Access the admin dashboard to view:
- Total assessments collected
- Severity distribution
- Data quality metrics
- Model performance statistics
- Training data export

**Access**: Click "🧠 Admin: View ML Training Dashboard" from onboarding screen

## 🧪 Testing

### Manual Testing Flow
1. Complete a test assessment
2. Try different PHQ-9 score ranges:
   - Minimal: 0-4
   - Mild: 5-9
   - Moderate: 10-14
   - Moderately Severe: 15-19
   - Severe: 20-27
3. Test face scanning (uses webcam)
4. View counselor recommendations
5. Check ML dashboard for data

### System Tests
- Click "Run System Tests" to verify:
  - Backend API health
  - BigQuery connection
  - Data pipeline
  - ML endpoints
  - Encryption availability

## 🚨 Crisis Protocols

### High-Risk Detection
- PHQ-9 score ≥ 20
- Question 9 score ≥ 2 (suicidal ideation)

### Automatic Actions
- Red "Critical Risk" badge
- Emergency contact recommendation
- Crisis hotline display
- Immediate professional intervention suggestion

### Emergency Contacts
- **988 Suicide & Crisis Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741

## 📱 Responsive Design

The app is fully responsive and works on:
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 768px)

Medical aesthetic maintained across all breakpoints.

## 🎯 Production Deployment

### Deployment Checklist
- [ ] Configure Supabase project
- [ ] Set up Google Cloud credentials (if using BigQuery)
- [ ] Review privacy policy and consent text
- [ ] Test all user flows
- [ ] Verify crisis detection protocols
- [ ] Set up monitoring and alerts
- [ ] HIPAA compliance review
- [ ] Legal review of data handling

### Environment Variables
See `.env.example` for required configuration.

## 📖 Documentation

- **Setup Guide**: `/README_IMPORTANT.md`
- **BigQuery Fix**: `/CREDENTIALS_FIX_GUIDE.md`
- **Google Cloud Setup**: `/GOOGLE_CLOUD_SETUP.md`
- **Architecture**: In-app ML Dashboard

## 🤝 Contributing

This is a production healthcare application. Any contributions must:
- Maintain HIPAA compliance
- Pass security review
- Include tests
- Follow medical device guidelines
- Get clinical validation

## ⚠️ Medical Disclaimer

**IMPORTANT**: MindLens is a screening tool, not a diagnostic instrument.

- Not a replacement for professional mental health evaluation
- Results should be reviewed by licensed clinicians
- Emergency cases require immediate professional intervention
- This is a prototype/demo application

**For real clinical use:**
- Obtain proper medical certifications
- Conduct clinical validation studies
- Implement comprehensive legal compliance
- Get approval from relevant healthcare authorities

## 📄 License

This project is for educational and demonstration purposes.

For production use in healthcare, please:
- Consult with legal counsel
- Obtain necessary certifications
- Implement full HIPAA compliance
- Conduct security audits

## 🙏 Acknowledgments

- PHQ-9 questionnaire: Developed by Drs. Robert L. Spitzer, Janet B.W. Williams, Kurt Kroenke
- shadcn/ui for component library
- Supabase for backend infrastructure
- Google Cloud Platform for ML infrastructure

## 📞 Support

For questions about:
- **Setup**: See `/README_IMPORTANT.md`
- **BigQuery**: See `/CREDENTIALS_FIX_GUIDE.md`
- **Architecture**: Check ML Dashboard
- **Security**: Review encryption implementation in `/lib/encryption.ts`

## 🎉 Status

✅ **Fully Functional** - All core features working
⚠️ **BigQuery Optional** - ML features can be enabled later

**Start using MindLens now!** The app works perfectly without additional configuration.

---

**Built with ❤️ for mental health awareness**

*If you or someone you know is in crisis, call 988 (US) or your local emergency services.*
  
