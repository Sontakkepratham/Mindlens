# 🚀 Google Cloud Run Deployment Guide for MindLens

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ Google Cloud Platform account
- ✅ Google Cloud SDK (`gcloud`) installed
- ✅ Docker installed (for local testing)
- ✅ GCP project with billing enabled
- ✅ Cloud Run API enabled
- ✅ Container Registry API enabled

---

## 🛠️ Quick Setup

### 1. **Install Google Cloud SDK**

```bash
# macOS
brew install --cask google-cloud-sdk

# Linux
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Windows
# Download from: https://cloud.google.com/sdk/docs/install
```

### 2. **Authenticate & Configure**

```bash
# Login to Google Cloud
gcloud auth login

# Set your project ID
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

---

## 🚢 Deployment Methods

### **Method 1: Automated Deployment (Recommended)**

#### Using Cloud Build (from source):

```bash
# Deploy directly from source code
gcloud run deploy mindlens \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --port 8080
```

**What this does:**
- ✅ Builds Docker image automatically
- ✅ Pushes to Container Registry
- ✅ Deploys to Cloud Run
- ✅ Sets up auto-scaling (0-10 instances)
- ✅ Configures health checks

---

### **Method 2: Using Cloud Build Config**

```bash
# Submit build using cloudbuild.yaml
gcloud builds submit --config cloudbuild.yaml

# The service will be automatically deployed after build
```

**Benefits:**
- ✅ Reproducible builds
- ✅ CI/CD ready
- ✅ Build history tracking
- ✅ Automated testing support

---

### **Method 3: Manual Docker Build & Deploy**

#### Step 1: Build Docker image locally

```bash
# Build the image
docker build -t gcr.io/YOUR_PROJECT_ID/mindlens:latest .

# Test locally
docker run -p 8080:8080 gcr.io/YOUR_PROJECT_ID/mindlens:latest

# Visit http://localhost:8080 to test
```

#### Step 2: Push to Container Registry

```bash
# Configure Docker to use gcloud credentials
gcloud auth configure-docker

# Push the image
docker push gcr.io/YOUR_PROJECT_ID/mindlens:latest
```

#### Step 3: Deploy to Cloud Run

```bash
gcloud run deploy mindlens \
  --image gcr.io/YOUR_PROJECT_ID/mindlens:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated
```

---

## ⚙️ Configuration Options

### **Basic Deployment**

```bash
gcloud run deploy mindlens \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

### **Production Deployment with Custom Settings**

```bash
gcloud run deploy mindlens \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 2 \
  --min-instances 1 \
  --max-instances 100 \
  --timeout 300 \
  --concurrency 80 \
  --port 8080 \
  --set-env-vars "NODE_ENV=production,LOG_LEVEL=info" \
  --ingress all \
  --cpu-throttling \
  --session-affinity
```

### **Deployment with Authentication (Recommended for Healthcare)**

```bash
gcloud run deploy mindlens \
  --source . \
  --region us-central1 \
  --no-allow-unauthenticated \
  --ingress internal-and-cloud-load-balancing
```

---

## 🌍 Environment Variables

### **Set Environment Variables**

```bash
# Method 1: During deployment
gcloud run deploy mindlens \
  --source . \
  --set-env-vars "SUPABASE_URL=https://xxx.supabase.co,SUPABASE_ANON_KEY=eyJxxx..."

# Method 2: Update existing service
gcloud run services update mindlens \
  --update-env-vars "NODE_ENV=production,API_TIMEOUT=30000"

# Method 3: From .env file
gcloud run services update mindlens \
  --env-vars-file .env.production
```

### **Create .env.production file:**

```bash
cat > .env.production << EOF
NODE_ENV=production
API_TIMEOUT=30000
LOG_LEVEL=info
EOF
```

---

## 🔒 Secrets Management (HIPAA Compliance)

### **Store Sensitive Data in Secret Manager**

```bash
# Enable Secret Manager API
gcloud services enable secretmanager.googleapis.com

# Create secrets
echo -n "your-supabase-service-role-key" | \
  gcloud secrets create SUPABASE_SERVICE_ROLE_KEY --data-file=-

echo -n "your-google-cloud-credentials" | \
  gcloud secrets create GOOGLE_CLOUD_CREDENTIALS --data-file=-

# Grant Cloud Run access to secrets
gcloud secrets add-iam-policy-binding SUPABASE_SERVICE_ROLE_KEY \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Deploy with secrets
gcloud run deploy mindlens \
  --source . \
  --set-secrets="SUPABASE_SERVICE_ROLE_KEY=SUPABASE_SERVICE_ROLE_KEY:latest,GOOGLE_CLOUD_CREDENTIALS=GOOGLE_CLOUD_CREDENTIALS:latest"
```

---

## 🔧 Custom Domain Setup

### **Map Custom Domain**

```bash
# Add domain mapping
gcloud run domain-mappings create \
  --service mindlens \
  --domain app.mindlens.com \
  --region us-central1

# Follow the DNS configuration instructions provided
```

### **SSL/TLS Certificate**

Cloud Run automatically provisions and manages SSL certificates for custom domains.

---

## 📊 Monitoring & Logging

### **View Logs**

```bash
# Stream logs in real-time
gcloud run services logs tail mindlens --region us-central1

# View recent logs
gcloud run services logs read mindlens --region us-central1 --limit 100

# Filter logs
gcloud run services logs read mindlens \
  --region us-central1 \
  --filter="severity>=ERROR"
```

### **View Service Details**

```bash
# Get service information
gcloud run services describe mindlens --region us-central1

# List all Cloud Run services
gcloud run services list
```

### **Metrics & Monitoring**

Access Google Cloud Console:
1. Go to **Cloud Run** → **mindlens**
2. Click **Metrics** tab
3. View:
   - Request count
   - Request latency
   - Container CPU utilization
   - Container memory utilization
   - Billable container time

---

## 🚦 Health Checks

Cloud Run automatically configures health checks. Test manually:

```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe mindlens \
  --region us-central1 \
  --format 'value(status.url)')

# Test health endpoint
curl $SERVICE_URL/health

# Test main app
curl $SERVICE_URL
```

---

## 🔄 CI/CD Integration

### **GitHub Actions Example**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches:
      - main

env:
  PROJECT_ID: your-project-id
  SERVICE_NAME: mindlens
  REGION: us-central1

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Setup Cloud SDK
      uses: google-github-actions/setup-gcloud@v1
      with:
        service_account_key: ${{ secrets.GCP_SA_KEY }}
        project_id: ${{ env.PROJECT_ID }}
    
    - name: Deploy to Cloud Run
      run: |
        gcloud run deploy ${{ env.SERVICE_NAME }} \
          --source . \
          --region ${{ env.REGION }} \
          --platform managed \
          --allow-unauthenticated
```

---

## 💰 Cost Optimization

### **Optimize for Cost**

```bash
# Minimal configuration (Free tier eligible)
gcloud run deploy mindlens \
  --source . \
  --region us-central1 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --concurrency 80 \
  --cpu-throttling
```

**Free Tier Limits:**
- ✅ 2 million requests per month
- ✅ 360,000 GB-seconds of memory
- ✅ 180,000 vCPU-seconds of compute time

### **Cost Monitoring**

```bash
# Estimate costs
gcloud alpha run services recommendations list \
  --service mindlens \
  --region us-central1
```

---

## 🔐 Security Best Practices

### **1. Enable VPC Connector (for backend access)**

```bash
# Create VPC connector
gcloud compute networks vpc-access connectors create mindlens-connector \
  --region us-central1 \
  --range 10.8.0.0/28

# Deploy with VPC connector
gcloud run deploy mindlens \
  --source . \
  --vpc-connector mindlens-connector
```

### **2. Enable Binary Authorization**

```bash
# Require signed container images
gcloud run deploy mindlens \
  --source . \
  --binary-authorization default
```

### **3. Enable CMEK (Customer-Managed Encryption Keys)**

```bash
# Use customer-managed encryption keys
gcloud run deploy mindlens \
  --source . \
  --key projects/PROJECT_ID/locations/LOCATION/keyRings/KEYRING/cryptoKeys/KEY
```

---

## 🧪 Testing Deployment

### **Local Testing with Docker**

```bash
# Build locally
docker build -t mindlens-test .

# Run locally
docker run -p 8080:8080 mindlens-test

# Test
curl http://localhost:8080
```

### **Test Cloud Run Service**

```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe mindlens \
  --region us-central1 \
  --format 'value(status.url)')

# Health check
curl -I $SERVICE_URL/health

# Load test (optional)
ab -n 1000 -c 10 $SERVICE_URL/
```

---

## 📋 Deployment Checklist

### **Pre-Deployment**

- [ ] Google Cloud project created
- [ ] Billing enabled
- [ ] APIs enabled (Cloud Run, Container Registry)
- [ ] `gcloud` CLI configured
- [ ] Dockerfile tested locally
- [ ] Environment variables prepared
- [ ] Secrets stored in Secret Manager

### **Deployment**

- [ ] Code committed to repository
- [ ] Docker build successful
- [ ] Deployment command executed
- [ ] Service URL accessible
- [ ] Health check passing
- [ ] Environment variables set
- [ ] Secrets mounted correctly

### **Post-Deployment**

- [ ] Custom domain configured (if needed)
- [ ] SSL certificate verified
- [ ] Monitoring dashboard configured
- [ ] Logging enabled
- [ ] Alerts configured
- [ ] Backup strategy implemented
- [ ] Security scan completed

---

## 🚨 Troubleshooting

### **Common Issues**

#### **1. Build Fails**

```bash
# Check build logs
gcloud builds log $(gcloud builds list --limit 1 --format 'value(id)')

# Common fixes:
# - Check Dockerfile syntax
# - Verify package.json dependencies
# - Ensure sufficient build timeout
```

#### **2. Service Won't Start**

```bash
# Check service logs
gcloud run services logs read mindlens --limit 50

# Common fixes:
# - Verify PORT=8080
# - Check health check endpoint
# - Review startup command
```

#### **3. Memory Issues**

```bash
# Increase memory
gcloud run services update mindlens \
  --memory 1Gi
```

#### **4. Permission Denied**

```bash
# Add IAM permissions
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="user:your-email@gmail.com" \
  --role="roles/run.admin"
```

---

## 🎯 Quick Commands Reference

```bash
# Deploy
gcloud run deploy mindlens --source . --region us-central1

# View logs
gcloud run services logs tail mindlens --region us-central1

# Describe service
gcloud run services describe mindlens --region us-central1

# Update service
gcloud run services update mindlens --memory 1Gi --region us-central1

# Delete service
gcloud run services delete mindlens --region us-central1

# List services
gcloud run services list

# Get service URL
gcloud run services describe mindlens --format 'value(status.url)' --region us-central1
```

---

## 📚 Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Dockerfile Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [HIPAA Compliance on GCP](https://cloud.google.com/security/compliance/hipaa)

---

## 🎉 Success!

Your MindLens application should now be running on Google Cloud Run!

**Service URL:** `https://mindlens-xxxxx.run.app`

**Next Steps:**
1. Configure custom domain
2. Set up monitoring and alerts
3. Implement CI/CD pipeline
4. Configure auto-scaling policies
5. Set up backup and disaster recovery
