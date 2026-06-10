#!/bin/bash

# ========================================
# MindLens - Cloud Run Rollback Script
# ========================================
# 
# This script rolls back to a previous revision
# 
# Usage: ./rollback.sh [revision-name]
# Example: ./rollback.sh mindlens-00005-abc
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SERVICE_NAME="mindlens"
REGION=${2:-us-central1}

echo -e "${BLUE}"
echo "========================================="
echo "   MindLens Rollback Tool"
echo "========================================="
echo -e "${NC}"

# Get project ID
PROJECT_ID=$(gcloud config get-value project)

# List recent revisions
echo -e "${YELLOW}Recent revisions:${NC}"
gcloud run revisions list \
  --service ${SERVICE_NAME} \
  --region ${REGION} \
  --limit 10 \
  --format "table(name,status,created,traffic)"

# Get revision to rollback to
if [ -z "$1" ]; then
    echo ""
    read -p "Enter revision name to rollback to: " REVISION_NAME
else
    REVISION_NAME=$1
fi

# Confirm rollback
echo ""
echo -e "${YELLOW}WARNING: This will rollback to revision: ${REVISION_NAME}${NC}"
read -p "Are you sure? (yes/no) " -r
echo

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo -e "${RED}Rollback cancelled${NC}"
    exit 1
fi

# Perform rollback
echo -e "${BLUE}Rolling back to ${REVISION_NAME}...${NC}"

gcloud run services update-traffic ${SERVICE_NAME} \
  --to-revisions ${REVISION_NAME}=100 \
  --region ${REGION}

echo -e "${GREEN}✓ Rollback successful!${NC}"

# Get service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
  --region ${REGION} \
  --format 'value(status.url)')

echo ""
echo -e "${BLUE}Service URL:${NC} ${SERVICE_URL}"
echo -e "${YELLOW}Verify the rollback:${NC} curl ${SERVICE_URL}/health"
