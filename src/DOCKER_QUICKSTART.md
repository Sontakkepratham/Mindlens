# 🐳 Docker & Cloud Run Quick Start Guide

## 📦 Files Created

Your project now includes complete Docker and Cloud Run deployment infrastructure:

### **Docker Files**
- ✅ `Dockerfile` - Multi-stage production build
- ✅ `.dockerignore` - Excludes unnecessary files from build
- ✅ `docker-compose.yml` - Local development setup
- ✅ `nginx.conf` - Optional reverse proxy configuration

### **Cloud Run Deployment**
- ✅ `cloudbuild.yaml` - Automated CI/CD configuration
- ✅ `deploy.sh` - Interactive deployment script
- ✅ `rollback.sh` - Rollback to previous version
- ✅ `manage.sh` - Service management utility

### **Configuration**
- ✅ `.env.example` - Environment variables template
- ✅ `CLOUD_RUN_DEPLOYMENT.md` - Complete deployment guide

---

## 🚀 Quick Deploy (3 Commands)

### **1. One-Line Deploy to Cloud Run**

```bash
# Authenticate and deploy in one go
gcloud auth login && \
gcloud config set project YOUR_PROJECT_ID && \
gcloud run deploy mindlens --source . --region us-central1 --allow-unauthenticated
```

### **2. Using the Deploy Script (Recommended)**

```bash
# Make scripts executable
chmod +x deploy.sh manage.sh rollback.sh

# Deploy to production
./deploy.sh production us-central1

# Deploy to staging
./deploy.sh staging us-west1
```

### **3. Using Cloud Build**

```bash
# Deploy with cloudbuild.yaml
gcloud builds submit --config cloudbuild.yaml
```

---

## 🧪 Local Testing

### **Test with Docker**

```bash
# Build the image
docker build -t mindlens:local .

# Run locally on port 8080
docker run -p 8080:8080 mindlens:local

# Test in browser
open http://localhost:8080
```

### **Test with Docker Compose**

```bash
# Start all services
docker-compose up

# Start with rebuild
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down
```

---

## 🛠️ Management Commands

### **Using manage.sh Script**

```bash
# Make executable (first time only)
chmod +x manage.sh

# Show service status
./manage.sh status

# Stream logs in real-time
./manage.sh logs

# Get service URL
./manage.sh url

# Check health
./manage.sh health

# Scale service
./manage.sh scale

# View all revisions
./manage.sh revisions

# Open metrics dashboard
./manage.sh metrics

# Show help
./manage.sh help
```

### **Manual Commands**

```bash
# Get service URL
gcloud run services describe mindlens \
  --region us-central1 \
  --format 'value(status.url)'

# View logs
gcloud run services logs tail mindlens --region us-central1

# Update configuration
gcloud run services update mindlens \
  --memory 1Gi \
  --cpu 2 \
  --region us-central1

# Delete service
gcloud run services delete mindlens --region us-central1
```

---

## 🔧 Configuration

### **Environment Variables**

Create `.env.production`:

```bash
cp .env.example .env.production
# Edit .env.production with your values
```

**Deploy with environment variables:**

```bash
gcloud run deploy mindlens \
  --source . \
  --region us-central1 \
  --set-env-vars "$(cat .env.production | xargs)"
```

### **Secrets (Recommended for Sensitive Data)**

```bash
# Create secret
echo -n "your-secret-value" | \
  gcloud secrets create SECRET_NAME --data-file=-

# Grant access
gcloud secrets add-iam-policy-binding SECRET_NAME \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Deploy with secret
gcloud run deploy mindlens \
  --source . \
  --set-secrets="SECRET_NAME=SECRET_NAME:latest"
```

---

## 🔄 Rollback

### **Using rollback.sh Script**

```bash
# Make executable
chmod +x rollback.sh

# List revisions and rollback
./rollback.sh

# Rollback to specific revision
./rollback.sh mindlens-00005-abc
```

### **Manual Rollback**

```bash
# List revisions
gcloud run revisions list \
  --service mindlens \
  --region us-central1

# Rollback to previous revision
gcloud run services update-traffic mindlens \
  --to-revisions REVISION_NAME=100 \
  --region us-central1
```

---

## 📊 Monitoring

### **View Metrics**

```bash
# Open metrics dashboard
./manage.sh metrics

# Or manually:
# https://console.cloud.google.com/run/detail/REGION/mindlens/metrics
```

### **Stream Logs**

```bash
# Real-time logs
./manage.sh logs

# Or:
gcloud run services logs tail mindlens --region us-central1

# Filter by severity
gcloud run services logs read mindlens \
  --region us-central1 \
  --filter="severity>=ERROR"
```

### **Health Check**

```bash
# Automated health check
./manage.sh health

# Manual curl
SERVICE_URL=$(gcloud run services describe mindlens \
  --region us-central1 \
  --format 'value(status.url)')
curl $SERVICE_URL/health
```

---

## 🌍 Custom Domain

### **Add Custom Domain**

```bash
# Map domain
gcloud run domain-mappings create \
  --service mindlens \
  --domain app.mindlens.com \
  --region us-central1

# Follow DNS instructions provided
```

### **Verify SSL Certificate**

```bash
# List domain mappings
gcloud run domain-mappings list --region us-central1

# Describe mapping
gcloud run domain-mappings describe \
  --domain app.mindlens.com \
  --region us-central1
```

---

## 💰 Cost Control

### **Free Tier Configuration**

```bash
gcloud run deploy mindlens \
  --source . \
  --region us-central1 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --cpu-throttling
```

**Free Tier Limits:**
- ✅ 2M requests/month
- ✅ 360,000 GB-seconds memory
- ✅ 180,000 vCPU-seconds compute

### **Monitor Costs**

```bash
# View cost recommendations
gcloud alpha run services recommendations list \
  --service mindlens \
  --region us-central1
```

---

## 🔒 Security Best Practices

### **1. Disable Public Access (HIPAA Compliant)**

```bash
gcloud run deploy mindlens \
  --source . \
  --no-allow-unauthenticated \
  --ingress internal-and-cloud-load-balancing
```

### **2. Use Service Account**

```bash
# Create service account
gcloud iam service-accounts create mindlens-sa \
  --display-name "MindLens Service Account"

# Deploy with service account
gcloud run deploy mindlens \
  --source . \
  --service-account mindlens-sa@PROJECT_ID.iam.gserviceaccount.com
```

### **3. Enable Binary Authorization**

```bash
gcloud run deploy mindlens \
  --source . \
  --binary-authorization default
```

---

## 🚨 Troubleshooting

### **Build Fails**

```bash
# Check build logs
gcloud builds log $(gcloud builds list --limit 1 --format 'value(id)')

# Test Docker build locally
docker build -t mindlens:test .
```

### **Service Won't Start**

```bash
# Check logs
./manage.sh logs

# Verify port 8080
# Verify health check endpoint
# Check environment variables
```

### **Permission Issues**

```bash
# Add Cloud Run Admin role
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="user:your-email@gmail.com" \
  --role="roles/run.admin"
```

### **Memory Issues**

```bash
# Increase memory
./manage.sh scale
# Or:
gcloud run services update mindlens --memory 1Gi
```

---

## 📋 Deployment Checklist

### **Before First Deployment**

- [ ] Install `gcloud` CLI
- [ ] Install Docker
- [ ] Set GCP project: `gcloud config set project PROJECT_ID`
- [ ] Enable APIs: Cloud Run, Container Registry, Cloud Build
- [ ] Test build locally: `docker build -t mindlens:test .`

### **For Each Deployment**

- [ ] Test locally with Docker
- [ ] Commit code to repository
- [ ] Run deployment: `./deploy.sh production us-central1`
- [ ] Verify deployment: `./manage.sh health`
- [ ] Check logs: `./manage.sh logs`
- [ ] Test service URL
- [ ] Monitor metrics for 5-10 minutes

### **Post-Deployment**

- [ ] Configure custom domain (if needed)
- [ ] Set up monitoring alerts
- [ ] Document service URL
- [ ] Update DNS records (if custom domain)
- [ ] Verify SSL certificate

---

## 🎯 Common Workflows

### **Deploy New Version**

```bash
# 1. Test locally
docker build -t mindlens:test .
docker run -p 8080:8080 mindlens:test

# 2. Deploy to Cloud Run
./deploy.sh production us-central1

# 3. Verify
./manage.sh health
./manage.sh logs
```

### **Rollback After Issue**

```bash
# 1. Check current status
./manage.sh status

# 2. View revisions
./manage.sh revisions

# 3. Rollback
./rollback.sh REVISION_NAME

# 4. Verify
./manage.sh health
```

### **Scale for Traffic Spike**

```bash
# Quick scale up
gcloud run services update mindlens \
  --min-instances 10 \
  --max-instances 100 \
  --region us-central1

# Scale back down
gcloud run services update mindlens \
  --min-instances 0 \
  --max-instances 10 \
  --region us-central1
```

---

## 📚 Additional Resources

- **Full Deployment Guide:** `CLOUD_RUN_DEPLOYMENT.md`
- **Docker Documentation:** https://docs.docker.com
- **Cloud Run Docs:** https://cloud.google.com/run/docs
- **Cloud Build Docs:** https://cloud.google.com/build/docs

---

## ✅ Quick Reference

```bash
# Deploy
./deploy.sh production us-central1

# Manage
./manage.sh status    # Check status
./manage.sh logs      # View logs
./manage.sh health    # Health check
./manage.sh scale     # Scale service

# Rollback
./rollback.sh         # Interactive rollback

# Manual commands
gcloud run deploy mindlens --source . --region us-central1
gcloud run services describe mindlens --region us-central1
gcloud run services delete mindlens --region us-central1
```

---

## 🎉 You're Ready!

Your MindLens application is now fully configured for Google Cloud Run deployment!

**Next Steps:**
1. Run `./deploy.sh production us-central1`
2. Visit the service URL
3. Set up monitoring
4. Configure custom domain (optional)
5. Implement CI/CD pipeline
