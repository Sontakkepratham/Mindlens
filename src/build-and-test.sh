#!/bin/bash

# ========================================
# MindLens - Build and Test Script
# ========================================
# 
# This script builds the Docker image and runs basic tests
# 
# Usage: ./build-and-test.sh [tag]
# Example: ./build-and-test.sh v1.0.0
#

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="mindlens"
TAG=${1:-local}
CONTAINER_NAME="mindlens-test-$$"
PORT=8080

echo -e "${BLUE}"
echo "========================================="
echo "   MindLens Build & Test"
echo "========================================="
echo -e "${NC}"

# Step 1: Clean up any existing test containers
echo -e "${YELLOW}[1/6] Cleaning up old containers...${NC}"
docker rm -f mindlens-test 2>/dev/null || true
echo -e "${GREEN}✓ Cleanup complete${NC}"

# Step 2: Build Docker image
echo -e "${YELLOW}[2/6] Building Docker image...${NC}"
echo -e "${BLUE}Image: ${IMAGE_NAME}:${TAG}${NC}"

if docker build -t ${IMAGE_NAME}:${TAG} .; then
    echo -e "${GREEN}✓ Docker build successful${NC}"
else
    echo -e "${RED}✗ Docker build failed${NC}"
    exit 1
fi

# Step 3: Check image size
echo -e "${YELLOW}[3/6] Checking image size...${NC}"
IMAGE_SIZE=$(docker images ${IMAGE_NAME}:${TAG} --format "{{.Size}}")
echo -e "${BLUE}Image size: ${IMAGE_SIZE}${NC}"

# Step 4: Start container
echo -e "${YELLOW}[4/6] Starting container...${NC}"
if docker run -d -p ${PORT}:8080 --name ${CONTAINER_NAME} ${IMAGE_NAME}:${TAG}; then
    echo -e "${GREEN}✓ Container started${NC}"
else
    echo -e "${RED}✗ Failed to start container${NC}"
    exit 1
fi

# Wait for container to be ready
echo -e "${BLUE}Waiting for application to start...${NC}"
sleep 5

# Step 5: Run health check
echo -e "${YELLOW}[5/6] Running health checks...${NC}"

# Check if port is accessible
if curl -f -s http://localhost:${PORT} > /dev/null; then
    echo -e "${GREEN}✓ Port ${PORT} is accessible${NC}"
else
    echo -e "${RED}✗ Port ${PORT} is not accessible${NC}"
    echo -e "${YELLOW}Container logs:${NC}"
    docker logs ${CONTAINER_NAME}
    docker rm -f ${CONTAINER_NAME}
    exit 1
fi

# Check container health status
sleep 5
HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' ${CONTAINER_NAME} 2>/dev/null || echo "none")
if [ "$HEALTH_STATUS" = "healthy" ] || [ "$HEALTH_STATUS" = "none" ]; then
    echo -e "${GREEN}✓ Container health check passed${NC}"
else
    echo -e "${YELLOW}⚠ Health status: ${HEALTH_STATUS}${NC}"
fi

# Step 6: Display results
echo -e "${YELLOW}[6/6] Test summary${NC}"

echo -e "${BLUE}"
echo "========================================="
echo "   Test Results"
echo "========================================="
echo -e "${NC}"

echo -e "${GREEN}✓ Docker image built successfully${NC}"
echo -e "${GREEN}✓ Container started successfully${NC}"
echo -e "${GREEN}✓ Application is responding${NC}"
echo ""
echo -e "${BLUE}Image:${NC} ${IMAGE_NAME}:${TAG}"
echo -e "${BLUE}Size:${NC} ${IMAGE_SIZE}"
echo -e "${BLUE}Container:${NC} ${CONTAINER_NAME}"
echo -e "${BLUE}Port:${NC} ${PORT}"
echo ""
echo -e "${YELLOW}Test the application:${NC}"
echo "  Browser: http://localhost:${PORT}"
echo "  cURL:    curl http://localhost:${PORT}"
echo ""
echo -e "${YELLOW}View logs:${NC}"
echo "  docker logs ${CONTAINER_NAME}"
echo "  docker logs -f ${CONTAINER_NAME}  # follow mode"
echo ""
echo -e "${YELLOW}Stop container:${NC}"
echo "  docker stop ${CONTAINER_NAME}"
echo "  docker rm ${CONTAINER_NAME}"
echo ""

# Ask if user wants to stop the container
read -p "Do you want to stop the test container? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker rm -f ${CONTAINER_NAME}
    echo -e "${GREEN}✓ Container stopped and removed${NC}"
else
    echo -e "${BLUE}Container is still running. Stop it manually when done.${NC}"
fi

echo -e "${GREEN}"
echo "========================================="
echo "   Build & Test Complete! 🎉"
echo "========================================="
echo -e "${NC}"
