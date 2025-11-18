#!/bin/bash

# ========================================
# MindLens - Cloud Run Management Script
# ========================================
# 
# Utility script for managing MindLens on Cloud Run
# 
# Usage: ./manage.sh [command]
# Commands: status, logs, describe, scale, delete, url
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SERVICE_NAME="mindlens"
REGION="us-central1"
PROJECT_ID=$(gcloud config get-value project)

# Help function
show_help() {
    echo -e "${BLUE}MindLens Cloud Run Management Tool${NC}"
    echo ""
    echo "Usage: ./manage.sh [command]"
    echo ""
    echo "Commands:"
    echo "  status      - Show service status"
    echo "  logs        - Tail service logs"
    echo "  describe    - Show detailed service information"
    echo "  scale       - Scale the service"
    echo "  delete      - Delete the service"
    echo "  url         - Get service URL"
    echo "  revisions   - List all revisions"
    echo "  metrics     - Open metrics dashboard"
    echo "  health      - Check health endpoint"
    echo "  help        - Show this help message"
    echo ""
}

# Status command
cmd_status() {
    echo -e "${YELLOW}Service Status:${NC}"
    gcloud run services describe ${SERVICE_NAME} \
        --region ${REGION} \
        --format "table(
            status.url,
            status.latestReadyRevisionName,
            status.traffic[0].percent,
            spec.template.spec.containers[0].resources.limits.memory,
            spec.template.spec.containers[0].resources.limits.cpu
        )"
}

# Logs command
cmd_logs() {
    echo -e "${YELLOW}Streaming logs (Ctrl+C to stop)...${NC}"
    gcloud run services logs tail ${SERVICE_NAME} \
        --region ${REGION}
}

# Describe command
cmd_describe() {
    echo -e "${YELLOW}Service Details:${NC}"
    gcloud run services describe ${SERVICE_NAME} \
        --region ${REGION}
}

# Scale command
cmd_scale() {
    echo -e "${YELLOW}Current scaling configuration:${NC}"
    gcloud run services describe ${SERVICE_NAME} \
        --region ${REGION} \
        --format "value(
            spec.template.metadata.annotations.autoscaling.knative.dev/minScale,
            spec.template.metadata.annotations.autoscaling.knative.dev/maxScale
        )"
    
    echo ""
    read -p "Enter min instances (0-100): " MIN_INSTANCES
    read -p "Enter max instances (1-1000): " MAX_INSTANCES
    
    echo -e "${BLUE}Scaling service...${NC}"
    gcloud run services update ${SERVICE_NAME} \
        --region ${REGION} \
        --min-instances ${MIN_INSTANCES} \
        --max-instances ${MAX_INSTANCES}
    
    echo -e "${GREEN}✓ Service scaled successfully${NC}"
}

# Delete command
cmd_delete() {
    echo -e "${RED}WARNING: This will delete the ${SERVICE_NAME} service!${NC}"
    read -p "Are you absolutely sure? (type 'DELETE' to confirm): " CONFIRM
    
    if [ "$CONFIRM" = "DELETE" ]; then
        echo -e "${BLUE}Deleting service...${NC}"
        gcloud run services delete ${SERVICE_NAME} \
            --region ${REGION} \
            --quiet
        echo -e "${GREEN}✓ Service deleted${NC}"
    else
        echo -e "${YELLOW}Deletion cancelled${NC}"
    fi
}

# URL command
cmd_url() {
    SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
        --region ${REGION} \
        --format 'value(status.url)')
    
    echo -e "${GREEN}Service URL:${NC}"
    echo "${SERVICE_URL}"
    echo ""
    echo -e "${BLUE}Quick test:${NC}"
    echo "curl ${SERVICE_URL}/health"
}

# Revisions command
cmd_revisions() {
    echo -e "${YELLOW}Service Revisions:${NC}"
    gcloud run revisions list \
        --service ${SERVICE_NAME} \
        --region ${REGION} \
        --format "table(
            name,
            status.conditions.status,
            metadata.creationTimestamp,
            status.traffic
        )"
}

# Metrics command
cmd_metrics() {
    SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
        --region ${REGION} \
        --format 'value(status.url)')
    
    CONSOLE_URL="https://console.cloud.google.com/run/detail/${REGION}/${SERVICE_NAME}/metrics?project=${PROJECT_ID}"
    
    echo -e "${YELLOW}Metrics Dashboard:${NC}"
    echo "${CONSOLE_URL}"
    echo ""
    echo -e "${BLUE}Opening in browser...${NC}"
    
    # Try to open in default browser
    if command -v xdg-open &> /dev/null; then
        xdg-open "${CONSOLE_URL}"
    elif command -v open &> /dev/null; then
        open "${CONSOLE_URL}"
    else
        echo "Please open the URL manually"
    fi
}

# Health check command
cmd_health() {
    SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
        --region ${REGION} \
        --format 'value(status.url)')
    
    echo -e "${YELLOW}Checking health endpoint...${NC}"
    
    if curl -f -s "${SERVICE_URL}/health" > /dev/null; then
        echo -e "${GREEN}✓ Service is healthy${NC}"
        
        echo ""
        echo -e "${BLUE}Full response:${NC}"
        curl -s "${SERVICE_URL}/health"
        echo ""
    else
        echo -e "${RED}✗ Service health check failed${NC}"
        exit 1
    fi
}

# Main command router
case "$1" in
    status)
        cmd_status
        ;;
    logs)
        cmd_logs
        ;;
    describe)
        cmd_describe
        ;;
    scale)
        cmd_scale
        ;;
    delete)
        cmd_delete
        ;;
    url)
        cmd_url
        ;;
    revisions)
        cmd_revisions
        ;;
    metrics)
        cmd_metrics
        ;;
    health)
        cmd_health
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
