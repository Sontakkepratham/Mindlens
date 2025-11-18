#!/bin/bash

# ========================================
# MindLens - Google Cloud Run Deployment Script
# ========================================
# 
# This script automates the deployment of MindLens to Google Cloud Run
# 
# Usage: ./deploy.sh [environment] [region]
# Example: ./deploy.sh production us-central1
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT=${1:-production}
REGION=${2:-us-central1}
SERVICE_NAME="mindlens"

# Banner
echo -e "${BLUE}"
echo "========================================="
echo "   MindLens Cloud Run Deployment"
echo "========================================="
echo -e "${NC}"

# Step 1: Verify prerequisites
echo -e "${YELLOW}[1/7] Verifying prerequisites...${NC}"

if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI not found. Please install Google Cloud SDK.${NC}"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker not found. Please install Docker.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites verified${NC}"

# Step 2: Get project ID
echo -e "${YELLOW}[2/7] Getting GCP project information...${NC}"

PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: No GCP project set. Run: gcloud config set project PROJECT_ID${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Project ID: ${PROJECT_ID}${NC}"

# Step 3: Enable required APIs
echo -e "${YELLOW}[3/7] Enabling required Google Cloud APIs...${NC}"

gcloud services enable run.googleapis.com --project=$PROJECT_ID 2>/dev/null || true
gcloud services enable containerregistry.googleapis.com --project=$PROJECT_ID 2>/dev/null || true
gcloud services enable cloudbuild.googleapis.com --project=$PROJECT_ID 2>/dev/null || true

echo -e "${GREEN}✓ APIs enabled${NC}"

# Step 4: Build Docker image (optional - for local testing)
echo -e "${YELLOW}[4/7] Testing Docker build locally...${NC}"

read -p "Do you want to test Docker build locally? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker build -t ${SERVICE_NAME}:local .
    echo -e "${GREEN}✓ Docker build successful${NC}"
else
    echo -e "${BLUE}Skipping local Docker build${NC}"
fi

# Step 5: Configure deployment settings
echo -e "${YELLOW}[5/7] Configuring deployment settings...${NC}"

# Deployment configuration
MEMORY="512Mi"
CPU="1"
MIN_INSTANCES="0"
MAX_INSTANCES="10"
TIMEOUT="300"
CONCURRENCY="80"

if [ "$ENVIRONMENT" = "production" ]; then
    MEMORY="1Gi"
    CPU="2"
    MIN_INSTANCES="1"
    MAX_INSTANCES="100"
fi

echo -e "${BLUE}Configuration:${NC}"
echo "  Environment: $ENVIRONMENT"
echo "  Region: $REGION"
echo "  Memory: $MEMORY"
echo "  CPU: $CPU"
echo "  Instances: $MIN_INSTANCES-$MAX_INSTANCES"

# Step 6: Deploy to Cloud Run
echo -e "${YELLOW}[6/7] Deploying to Google Cloud Run...${NC}"

read -p "Proceed with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Deployment cancelled${NC}"
    exit 1
fi

echo -e "${BLUE}Starting deployment...${NC}"

gcloud run deploy ${SERVICE_NAME} \
  --source . \
  --region ${REGION} \
  --platform managed \
  --allow-unauthenticated \
  --memory ${MEMORY} \
  --cpu ${CPU} \
  --min-instances ${MIN_INSTANCES} \
  --max-instances ${MAX_INSTANCES} \
  --timeout ${TIMEOUT} \
  --concurrency ${CONCURRENCY} \
  --port 8080 \
  --set-env-vars "NODE_ENV=${ENVIRONMENT}" \
  --project ${PROJECT_ID}

# Step 7: Get service URL
echo -e "${YELLOW}[7/7] Retrieving service information...${NC}"

SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
  --region ${REGION} \
  --format 'value(status.url)' \
  --project ${PROJECT_ID})

# Success message
echo -e "${GREEN}"
echo "========================================="
echo "   Deployment Successful! 🚀"
echo "========================================="
echo -e "${NC}"
echo -e "${BLUE}Service URL:${NC} ${SERVICE_URL}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Test the deployment: curl ${SERVICE_URL}/health"
echo "  2. View logs: gcloud run services logs tail ${SERVICE_NAME} --region ${REGION}"
echo "  3. Configure custom domain (optional)"
echo "  4. Set up monitoring and alerts"
echo ""
echo -e "${GREEN}Happy deploying! 🎉${NC}"
