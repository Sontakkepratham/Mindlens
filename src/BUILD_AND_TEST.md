# 🔨 Build & Test Guide for MindLens Docker Deployment

## 📋 Overview

This guide walks you through building, testing, and deploying the MindLens Docker container locally before pushing to Google Cloud Run.

---

## ✅ Prerequisites Checklist

Before you begin, ensure you have:

- [ ] **Docker** installed and running
  ```bash
  docker --version  # Should show Docker version 20.x or higher
  ```

- [ ] **Node.js** 18+ installed (for local development)
  ```bash
  node --version  # Should show v18.x or higher
  ```

- [ ] **Google Cloud SDK** installed (for deployment)
  ```bash
  gcloud --version
  ```

- [ ] **Project dependencies** installed
  ```bash
  npm install
  ```

---

## 🏗️ Step 1: Local Development Build

### Test the app locally without Docker first:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build production version
npm run build

# Preview production build
npm run preview
```

**Expected output:**
- ✅ Development server runs on http://localhost:5173
- ✅ Production build creates `/dist` folder
- ✅ No build errors

---

## 🐳 Step 2: Build Docker Image

### Build the Docker image locally:

```bash
# Build the image (this will take 2-5 minutes first time)
docker build -t mindlens:local .

# Check the image was created
docker images | grep mindlens
```

**Expected output:**
```
mindlens  local  abc123def456  2 minutes ago  150MB
```

### Troubleshooting build errors:

**Error: "npm ci failed"**
```bash
# Solution: Make sure package.json and package-lock.json exist
ls -la package*.json
```

**Error: "COPY failed"**
```bash
# Solution: Check .dockerignore isn't blocking required files
cat .dockerignore
```

**Error: "Build stage failed"**
```bash
# Solution: Test the build locally first
npm run build
```

---

## 🧪 Step 3: Test Docker Container Locally

### Run the container:

```bash
# Run the container on port 8080
docker run -p 8080:8080 mindlens:local

# Or run in background (detached mode)
docker run -d -p 8080:8080 --name mindlens-test mindlens:local
```

### Test the application:

```bash
# Method 1: Browser
open http://localhost:8080

# Method 2: cURL
curl http://localhost:8080

# Method 3: Health check
curl http://localhost:8080/health
```

**Expected results:**
- ✅ App loads in browser on http://localhost:8080
- ✅ All pages navigate correctly
- ✅ No console errors
- ✅ Images and styles load properly

### View container logs:

```bash
# View logs (if running detached)
docker logs mindlens-test

# Follow logs in real-time
docker logs -f mindlens-test

# View last 50 lines
docker logs --tail 50 mindlens-test
```

### Stop and remove the test container:

```bash
# Stop the container
docker stop mindlens-test

# Remove the container
docker rm mindlens-test

# Or do both at once
docker rm -f mindlens-test
```

---

## 🔍 Step 4: Inspect Docker Image

### Check image details:

```bash
# View image layers and size
docker history mindlens:local

# Inspect image configuration
docker inspect mindlens:local

# Check image size
docker images mindlens:local --format "{{.Size}}"
```

**Expected image size:** 100-200 MB

### Optimize image size (if needed):

If your image is larger than 200MB, check:

```bash
# Make sure .dockerignore is working
cat .dockerignore

# Check what's being copied
docker run --rm mindlens:local ls -la /app
```

---

## 🧰 Step 5: Advanced Testing

### Test with environment variables:

```bash
# Create a test .env file
cat > .env.test << EOF
NODE_ENV=production
VITE_APP_NAME=MindLens Test
LOG_LEVEL=debug
EOF

# Run with env file
docker run -p 8080:8080 --env-file .env.test mindlens:local
```

### Test health check:

```bash
# Check if health check is working
docker inspect --format='{{json .State.Health}}' mindlens-test | jq

# Expected: "Status": "healthy"
```

### Test with limited resources (simulate Cloud Run):

```bash
# Run with memory and CPU limits
docker run -p 8080:8080 \
  --memory="512m" \
  --cpus="1.0" \
  --name mindlens-test \
  mindlens:local

# Monitor resource usage
docker stats mindlens-test
```

### Load testing:

```bash
# Install Apache Bench (if not installed)
# macOS: brew install apache-bench
# Ubuntu: sudo apt-get install apache2-utils

# Run load test (1000 requests, 10 concurrent)
ab -n 1000 -c 10 http://localhost:8080/

# Expected: All requests should return 200 OK
```

---

## 🚀 Step 6: Push to Google Container Registry

### Authenticate Docker with GCP:

```bash
# Configure Docker to use gcloud credentials
gcloud auth configure-docker

# Verify authentication
gcloud auth list
```

### Tag the image:

```bash
# Get your GCP project ID
export PROJECT_ID=$(gcloud config get-value project)

# Tag the image for GCR
docker tag mindlens:local gcr.io/$PROJECT_ID/mindlens:latest
docker tag mindlens:local gcr.io/$PROJECT_ID/mindlens:v1.0.0

# Verify tags
docker images | grep mindlens
```

### Push to Container Registry:

```bash
# Push the latest tag
docker push gcr.io/$PROJECT_ID/mindlens:latest

# Push the version tag
docker push gcr.io/$PROJECT_ID/mindlens:v1.0.0

# Verify the image in GCR
gcloud container images list --repository=gcr.io/$PROJECT_ID
```

**Expected output:**
```
NAME                           DIGEST        CREATE_TIME
gcr.io/your-project/mindlens   sha256:abc... 2024-01-15T10:30:00
```

---

## ☁️ Step 7: Deploy to Cloud Run

### Deploy from Container Registry:

```bash
# Deploy the image to Cloud Run
gcloud run deploy mindlens \
  --image gcr.io/$PROJECT_ID/mindlens:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --port 8080

# Get the deployed URL
gcloud run services describe mindlens \
  --region us-central1 \
  --format 'value(status.url)'
```

### Test the deployed service:

```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe mindlens \
  --region us-central1 \
  --format 'value(status.url)')

# Test with curl
curl $SERVICE_URL

# Load test the deployed service
ab -n 100 -c 5 $SERVICE_URL/
```

---

## 🔄 Step 8: Continuous Integration

### Build script for automated testing:

Create `build-and-test.sh`:

```bash
#!/bin/bash
set -e

echo "🔨 Building MindLens Docker image..."
docker build -t mindlens:test .

echo "🚀 Starting container..."
docker run -d -p 8080:8080 --name mindlens-ci-test mindlens:test

echo "⏳ Waiting for container to be ready..."
sleep 5

echo "🧪 Running health check..."
if curl -f http://localhost:8080/health; then
    echo "✅ Health check passed!"
else
    echo "❌ Health check failed!"
    docker logs mindlens-ci-test
    docker rm -f mindlens-ci-test
    exit 1
fi

echo "🧹 Cleaning up..."
docker rm -f mindlens-ci-test

echo "🎉 All tests passed!"
```

Make it executable and run:

```bash
chmod +x build-and-test.sh
./build-and-test.sh
```

---

## 🐛 Troubleshooting

### Problem: Container exits immediately

```bash
# Check logs
docker logs mindlens-test

# Run interactively to debug
docker run -it mindlens:local sh

# Inside container, test serve command
cd /app
ls -la dist/
serve -s dist -l 8080
```

### Problem: Port 8080 already in use

```bash
# Find what's using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or use a different port
docker run -p 9090:8080 mindlens:local
# Then access: http://localhost:9090
```

### Problem: Build is very slow

```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t mindlens:local .

# Check .dockerignore is excluding node_modules
cat .dockerignore | grep node_modules
```

### Problem: Image too large

```bash
# Check image size
docker images mindlens:local

# Analyze layers
docker history mindlens:local

# Common fixes:
# 1. Make sure .dockerignore excludes node_modules
# 2. Use multi-stage build (already implemented)
# 3. Remove unnecessary files in Dockerfile
```

### Problem: App doesn't work in container but works locally

```bash
# Compare environments
# Local:
npm run build && npm run preview

# Docker:
docker run -p 8080:8080 mindlens:local

# Check environment variables
docker run --rm mindlens:local env

# Check file permissions
docker run --rm mindlens:local ls -la /app/dist
```

---

## 📊 Performance Benchmarks

### Expected performance metrics:

**Build time:**
- First build: 3-5 minutes
- Cached builds: 30-60 seconds

**Image size:**
- Production image: 100-200 MB
- Builder stage (not pushed): 500+ MB

**Startup time:**
- Container start: <2 seconds
- Health check ready: <5 seconds

**Memory usage:**
- Idle: 50-100 MB
- Under load: 200-400 MB

**Response time:**
- Static assets: <50ms
- Initial page load: <500ms

---

## ✅ Deployment Checklist

### Before pushing to production:

- [ ] Local build successful (`npm run build`)
- [ ] Docker build successful (`docker build`)
- [ ] Container runs locally (`docker run`)
- [ ] Health check passes (`curl /health`)
- [ ] No errors in browser console
- [ ] All pages load correctly
- [ ] Images and styles display properly
- [ ] Forms submit successfully
- [ ] Authentication works
- [ ] API calls succeed (with test credentials)
- [ ] Load test passes (`ab -n 1000 -c 10`)
- [ ] Image size <200MB
- [ ] Container memory usage <500MB
- [ ] .dockerignore configured correctly
- [ ] .env.example created
- [ ] Secrets NOT in Docker image
- [ ] Health check endpoint working

### After deployment:

- [ ] Cloud Run service deployed
- [ ] Service URL accessible
- [ ] Health endpoint returns 200
- [ ] All pages accessible via HTTPS
- [ ] Logs show no errors
- [ ] Monitoring dashboard configured
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate valid

---

## 🎯 Quick Commands Reference

```bash
# Build
docker build -t mindlens:local .

# Run locally
docker run -p 8080:8080 mindlens:local

# Test
curl http://localhost:8080/health

# Push to GCR
docker tag mindlens:local gcr.io/$PROJECT_ID/mindlens:latest
docker push gcr.io/$PROJECT_ID/mindlens:latest

# Deploy to Cloud Run
gcloud run deploy mindlens \
  --image gcr.io/$PROJECT_ID/mindlens:latest \
  --region us-central1 \
  --allow-unauthenticated

# Cleanup
docker rm -f mindlens-test
docker rmi mindlens:local
```

---

## 📚 Additional Resources

- **Docker Best Practices:** https://docs.docker.com/develop/dev-best-practices/
- **Cloud Run Docs:** https://cloud.google.com/run/docs
- **Container Optimization:** https://cloud.google.com/run/docs/tips/general

---

## 🎉 Success!

If you've completed all steps successfully, your MindLens application is now:

✅ Containerized with Docker  
✅ Tested locally  
✅ Optimized for production  
✅ Ready for Google Cloud Run  
✅ HIPAA-compliant infrastructure  

**Next step:** Deploy with `./deploy.sh production us-central1`
