# MindLens Production Deployment Checklist

Use this checklist to ensure your deployment is complete and secure.

---

## 🔐 Security Setup

### Encryption Configuration
- [ ] Generate encryption key using `node scripts/generate-encryption-key.js`
- [ ] Copy ENCRYPTION_KEY_BASE64 value
- [ ] Add to Supabase Dashboard → Settings → Edge Functions → Environment Variables
- [ ] Verify key is NOT in version control (check .gitignore)
- [ ] Store backup copy in secure location (password manager, safe)
- [ ] Document key location for disaster recovery

### Google Cloud Platform (Optional but Recommended)
- [ ] Create GCP project: `mindlens-production`
- [ ] Enable BigQuery API
- [ ] Enable Vertex AI API
- [ ] Enable Cloud Storage API
- [ ] Enable Secret Manager API
- [ ] Create service account: `mindlens-backend`
- [ ] Grant BigQuery Admin role
- [ ] Grant AI Platform User role
- [ ] Grant Storage Admin role
- [ ] Download service account JSON key
- [ ] Add JSON to GOOGLE_CLOUD_CREDENTIALS environment variable
- [ ] Test BigQuery connection (check server logs)

---

## 🚀 Deployment

### Environment Variables (Supabase)
- [ ] SUPABASE_URL
- [ ] SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] SUPABASE_DB_URL
- [ ] ENCRYPTION_KEY_BASE64 ⚠️ **CRITICAL**
- [ ] GOOGLE_CLOUD_CREDENTIALS (optional)

### Deploy Server
- [ ] Install Supabase CLI: `npm install -g supabase`
- [ ] Login: `supabase login`
- [ ] Link project: `supabase link --project-ref YOUR_REF`
- [ ] Deploy: `supabase functions deploy server`
- [ ] Verify deployment (check logs)

---

## ✅ Verification

### Test Encryption
- [ ] Check server logs for: `🔐 AES-256-GCM encryption enabled with persistent key`
- [ ] Should NOT see: `⚠️  Using ephemeral encryption key`
- [ ] Submit test assessment
- [ ] Verify `encryptedData` field in database is base64 string
- [ ] Verify `encrypted` flag is `true`

### Test BigQuery (if configured)
- [ ] Check server logs for: `✅ BigQuery ready for ML training`
- [ ] Verify dataset `mindlens_ml_training` exists
- [ ] Verify tables created (assessment_records, emotion_analysis, etc.)
- [ ] Submit test assessment
- [ ] Query BigQuery to verify data is pseudonymized

### Test Authentication
- [ ] Create test account via signup
- [ ] Sign in with test account
- [ ] Verify access token works
- [ ] Sign out
- [ ] Try accessing protected endpoint without token (should fail)

### Test Data Export
- [ ] Sign in as test user
- [ ] Export data: `GET /export/my-data`
- [ ] Verify JSON download works
- [ ] Verify data is decrypted
- [ ] Verify all user data is included

### Test Account Deletion
- [ ] Create new test account
- [ ] Submit test data
- [ ] Delete account: `DELETE /export/delete-account`
- [ ] Verify all data deleted from database
- [ ] Verify cannot sign in with deleted account

### Test API Endpoints
- [ ] Health check: `GET /health`
- [ ] Submit assessment: `POST /assessment/submit`
- [ ] Get counselors: `GET /counselors/recommendations`
- [ ] Book session: `POST /sessions/book`
- [ ] Get dashboard: `GET /user/dashboard`
- [ ] Export data: `GET /export/my-data`
- [ ] Retention policy: `GET /export/retention-policy`

---

## 📊 Monitoring

### Setup Alerts
- [ ] Failed login attempts (>5 in 5 minutes)
- [ ] Encryption failures
- [ ] Crisis alerts triggered
- [ ] Server errors (500s)
- [ ] High latency (>2 seconds)
- [ ] Database connection failures

### Log Monitoring
- [ ] Configure log retention (90 days minimum)
- [ ] Set up log search/query capability
- [ ] Create dashboard for key metrics
- [ ] Schedule weekly log reviews

---

## 🔒 HIPAA Compliance

### Technical Safeguards
- [x] Access Control - JWT authentication
- [x] Audit Controls - Server logging
- [x] Integrity - AES-GCM MAC
- [x] Transmission Security - HTTPS/TLS
- [x] Encryption at Rest - AES-256-GCM
- [x] Encryption in Transit - TLS 1.3

### Administrative Safeguards
- [ ] Designate Privacy Officer
- [ ] Designate Security Officer
- [ ] Complete security risk assessment
- [ ] Document risk mitigation plan
- [ ] Create employee training program
- [ ] Conduct initial HIPAA training
- [ ] Schedule annual refresher training
- [ ] Document all policies and procedures

### Physical Safeguards
- [ ] Document facility access controls (for cloud providers)
- [ ] Document workstation security policies
- [ ] Document device and media controls

### Organizational Requirements
- [ ] Sign Business Associate Agreement with Supabase
- [ ] Sign Business Associate Agreement with Google Cloud
- [ ] Document all business associate relationships
- [ ] Create breach notification procedure
- [ ] Test breach notification procedure

---

## 📝 Legal Documentation

### Privacy & Compliance
- [ ] Create Privacy Policy
- [ ] Create Terms of Service
- [ ] Create HIPAA Notice of Privacy Practices
- [ ] Create Cookie Policy
- [ ] Create Data Retention Policy (publish it)
- [ ] Create Incident Response Plan
- [ ] Create Disaster Recovery Plan

### User-Facing
- [ ] Add Privacy Policy link to app
- [ ] Add Terms of Service link to app
- [ ] Add HIPAA Notice to app
- [ ] Create "Contact Us" page
- [ ] Add data export instructions
- [ ] Add account deletion instructions

---

## 🔧 Operational Setup

### Backup Procedures
- [ ] Verify Supabase automated backups enabled
- [ ] Test database restore procedure
- [ ] Document backup retention (90 days)
- [ ] Schedule monthly restore tests
- [ ] Document backup verification process

### Key Rotation
- [ ] Document key rotation procedure
- [ ] Schedule first rotation (90 days from now)
- [ ] Create key rotation checklist
- [ ] Test key rotation in staging
- [ ] Set calendar reminder

### Security Updates
- [ ] Subscribe to Supabase security announcements
- [ ] Subscribe to Deno security announcements
- [ ] Schedule monthly dependency updates
- [ ] Create update testing procedure

---

## 👥 Team Setup

### Access Control
- [ ] Document who has access to what
- [ ] Create admin user roles
- [ ] Create support user roles
- [ ] Document access request procedure
- [ ] Schedule quarterly access reviews

### Training
- [ ] HIPAA training for all team members
- [ ] Security awareness training
- [ ] Incident response training
- [ ] Breach notification training
- [ ] Document training completion

---

## 🚨 Emergency Procedures

### Crisis Response
- [ ] Document on-call counselor contact info
- [ ] Test crisis alert notifications
- [ ] Create crisis escalation procedure
- [ ] Document emergency resources (988, etc.)
- [ ] Test emergency protocols

### Security Incidents
- [ ] Create incident response team
- [ ] Document incident response steps
- [ ] Create incident severity levels
- [ ] Document notification requirements
- [ ] Create incident report template
- [ ] Schedule incident response drills

### Data Breach
- [ ] Document breach assessment procedure
- [ ] Create user notification template
- [ ] Document HHS notification procedure
- [ ] Create media notification template
- [ ] Document breach remediation steps

---

## 📱 User Experience

### Onboarding
- [ ] Test full user flow (signup → assessment → results)
- [ ] Verify consent forms displayed
- [ ] Verify privacy policy accessible
- [ ] Test counselor booking flow
- [ ] Test self-care resources

### Performance
- [ ] Test page load times (<3 seconds)
- [ ] Test assessment submission (<2 seconds)
- [ ] Test mobile responsiveness
- [ ] Test on multiple browsers
- [ ] Test on multiple devices

### Accessibility
- [ ] Test screen reader compatibility
- [ ] Verify keyboard navigation works
- [ ] Check color contrast ratios
- [ ] Test with accessibility tools
- [ ] Document accessibility features

---

## 🎯 Pre-Launch Final Checks

### 24 Hours Before Launch
- [ ] Final security scan
- [ ] Test all critical user flows
- [ ] Verify monitoring is active
- [ ] Verify backups are working
- [ ] Review all documentation
- [ ] Brief support team
- [ ] Prepare launch communications

### Launch Day
- [ ] Monitor error rates
- [ ] Monitor performance metrics
- [ ] Monitor user signups
- [ ] Monitor crisis alerts
- [ ] Check server logs every hour
- [ ] Have emergency contacts ready
- [ ] Document any issues

### First Week
- [ ] Daily log reviews
- [ ] Daily performance checks
- [ ] Collect user feedback
- [ ] Monitor encryption operations
- [ ] Monitor BigQuery costs
- [ ] Review access patterns
- [ ] Document lessons learned

---

## 📊 Success Metrics

### Technical Metrics
- [ ] 99.9% uptime
- [ ] <2s average response time
- [ ] 0 encryption failures
- [ ] 0 data breaches
- [ ] 0 unhandled errors

### Compliance Metrics
- [ ] 100% data encrypted at rest
- [ ] 100% API requests over HTTPS
- [ ] 100% crisis alerts responded to within 1 hour
- [ ] Data export requests fulfilled within 24 hours
- [ ] Account deletion requests fulfilled within 72 hours

### User Metrics
- [ ] Track user signups
- [ ] Track assessment completions
- [ ] Track counselor bookings
- [ ] Track data export requests
- [ ] Track account deletions

---

## 🎉 Launch Readiness

### Minimum Requirements
- ✅ ENCRYPTION_KEY_BASE64 set
- ✅ All environment variables configured
- ✅ Server deployed successfully
- ✅ Encryption verified working
- ✅ Authentication tested
- ✅ API endpoints tested
- ✅ Privacy policy published
- ✅ Terms of service published

### Recommended Before Launch
- ⚠️ BigQuery configured
- ⚠️ Business Associate Agreements signed
- ⚠️ Security risk assessment completed
- ⚠️ Employee training completed
- ⚠️ Monitoring alerts configured
- ⚠️ Backup procedures tested

### Nice to Have
- 📝 Vertex AI emotion analysis configured
- 📝 Google OAuth enabled
- 📝 Email provider configured
- 📝 SMS notifications configured
- 📝 Automated security scanning
- 📝 Penetration testing completed

---

## 📞 Emergency Contacts

### Technical Issues
- **Supabase Support**: support@supabase.io
- **Google Cloud Support**: https://cloud.google.com/support

### Security Issues
- **Security Team**: security@mindlens.health
- **Privacy Officer**: privacy@mindlens.health
- **HIPAA Compliance**: compliance@mindlens.health

### Crisis Response
- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **Emergency**: 911

---

## ✅ Final Sign-Off

Before launching to production, have the following people review and approve:

- [ ] **Technical Lead**: Code review complete, all tests passing
- [ ] **Security Officer**: Security measures implemented and verified
- [ ] **Privacy Officer**: Privacy controls in place, HIPAA requirements met
- [ ] **Legal Counsel**: Legal documentation reviewed and approved
- [ ] **Product Manager**: User experience tested and approved
- [ ] **Compliance Officer**: All compliance requirements met

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Reviewed By**: _______________
**Approved By**: _______________

---

**Status**: Ready for production deployment after completing critical items above

**Next Action**: 
1. Generate encryption key
2. Set environment variables
3. Deploy server
4. Run verification tests
5. Complete HIPAA documentation
