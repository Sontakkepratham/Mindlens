#!/bin/bash

# ========================================
# MindLens - Docker Setup Verification
# ========================================
# 
# Verifies that all Docker files are properly configured
# 
# Usage: ./verify-docker-setup.sh
#

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "========================================="
echo "   MindLens Docker Setup Verification"
echo "========================================="
echo -e "${NC}"

ERRORS=0
WARNINGS=0

# Check Dockerfile
echo -e "${YELLOW}Checking Dockerfile...${NC}"
if [ -f "Dockerfile" ]; then
    echo -e "${GREEN}✓ Dockerfile exists${NC}"
    
    # Check for multi-stage build
    if grep -q "FROM.*AS builder" Dockerfile; then
        echo -e "${GREEN}✓ Multi-stage build configured${NC}"
    else
        echo -e "${RED}✗ Multi-stage build not found${NC}"
        ERRORS=$((ERRORS + 1))
    fi
    
    # Check for port 8080
    if grep -q "8080" Dockerfile; then
        echo -e "${GREEN}✓ Port 8080 configured${NC}"
    else
        echo -e "${RED}✗ Port 8080 not found${NC}"
        ERRORS=$((ERRORS + 1))
    fi
    
    # Check for non-root user
    if grep -q "USER nodejs" Dockerfile; then
        echo -e "${GREEN}✓ Non-root user configured${NC}"
    else
        echo -e "${YELLOW}⚠ Non-root user not found${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
    
    # Check for health check
    if grep -q "HEALTHCHECK" Dockerfile; then
        echo -e "${GREEN}✓ Health check configured${NC}"
    else
        echo -e "${YELLOW}⚠ Health check not found${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}✗ Dockerfile not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check .dockerignore
echo ""
echo -e "${YELLOW}Checking .dockerignore...${NC}"
if [ -f ".dockerignore" ]; then
    echo -e "${GREEN}✓ .dockerignore exists${NC}"
    
    # Check for important exclusions
    if grep -q "node_modules" .dockerignore; then
        echo -e "${GREEN}✓ node_modules excluded${NC}"
    else
        echo -e "${RED}✗ node_modules not excluded${NC}"
        ERRORS=$((ERRORS + 1))
    fi
    
    if grep -q ".env" .dockerignore; then
        echo -e "${GREEN}✓ .env files excluded${NC}"
    else
        echo -e "${RED}✗ .env files not excluded${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}✗ .dockerignore not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check .env.example
echo ""
echo -e "${YELLOW}Checking .env.example...${NC}"
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓ .env.example exists${NC}"
    
    if grep -q "VITE_SUPABASE_URL" .env.example; then
        echo -e "${GREEN}✓ Supabase URL configured${NC}"
    else
        echo -e "${YELLOW}⚠ Supabase URL not found${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠ .env.example not found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check package.json
echo ""
echo -e "${YELLOW}Checking package.json...${NC}"
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓ package.json exists${NC}"
    
    # Check for build script
    if grep -q '"build"' package.json; then
        echo -e "${GREEN}✓ Build script found${NC}"
    else
        echo -e "${RED}✗ Build script not found${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}✗ package.json not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check deployment scripts
echo ""
echo -e "${YELLOW}Checking deployment scripts...${NC}"

if [ -f "deploy.sh" ]; then
    echo -e "${GREEN}✓ deploy.sh exists${NC}"
    if [ -x "deploy.sh" ]; then
        echo -e "${GREEN}✓ deploy.sh is executable${NC}"
    else
        echo -e "${YELLOW}⚠ deploy.sh is not executable (run: chmod +x deploy.sh)${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠ deploy.sh not found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -f "manage.sh" ]; then
    echo -e "${GREEN}✓ manage.sh exists${NC}"
    if [ -x "manage.sh" ]; then
        echo -e "${GREEN}✓ manage.sh is executable${NC}"
    else
        echo -e "${YELLOW}⚠ manage.sh is not executable (run: chmod +x manage.sh)${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠ manage.sh not found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -f "rollback.sh" ]; then
    echo -e "${GREEN}✓ rollback.sh exists${NC}"
else
    echo -e "${YELLOW}⚠ rollback.sh not found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -f "build-and-test.sh" ]; then
    echo -e "${GREEN}✓ build-and-test.sh exists${NC}"
else
    echo -e "${YELLOW}⚠ build-and-test.sh not found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check Cloud Build config
echo ""
echo -e "${YELLOW}Checking Cloud Build configuration...${NC}"
if [ -f "cloudbuild.yaml" ]; then
    echo -e "${GREEN}✓ cloudbuild.yaml exists${NC}"
else
    echo -e "${YELLOW}⚠ cloudbuild.yaml not found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check docker-compose.yml
echo ""
echo -e "${YELLOW}Checking Docker Compose...${NC}"
if [ -f "docker-compose.yml" ]; then
    echo -e "${GREEN}✓ docker-compose.yml exists${NC}"
else
    echo -e "${YELLOW}⚠ docker-compose.yml not found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check documentation
echo ""
echo -e "${YELLOW}Checking documentation...${NC}"
DOCS=("DOCKER_README.md" "CLOUD_RUN_DEPLOYMENT.md" "DOCKER_QUICKSTART.md" "BUILD_AND_TEST.md")
for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✓ $doc exists${NC}"
    else
        echo -e "${YELLOW}⚠ $doc not found${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
done

# Check prerequisites
echo ""
echo -e "${YELLOW}Checking system prerequisites...${NC}"

if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✓ Docker installed: $DOCKER_VERSION${NC}"
else
    echo -e "${RED}✗ Docker not installed${NC}"
    ERRORS=$((ERRORS + 1))
fi

if command -v gcloud &> /dev/null; then
    GCLOUD_VERSION=$(gcloud --version | head -n 1)
    echo -e "${GREEN}✓ gcloud installed: $GCLOUD_VERSION${NC}"
else
    echo -e "${YELLOW}⚠ gcloud not installed (required for Cloud Run deployment)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${YELLOW}⚠ Node.js not installed${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Summary
echo ""
echo -e "${BLUE}"
echo "========================================="
echo "   Verification Summary"
echo "========================================="
echo -e "${NC}"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}"
    echo "✓ Perfect! All checks passed!"
    echo ""
    echo "Your Docker setup is complete and ready for deployment."
    echo -e "${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Test locally:  docker build -t mindlens:local ."
    echo "  2. Run tests:     ./build-and-test.sh local"
    echo "  3. Deploy:        ./deploy.sh production us-central1"
    echo ""
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}"
    echo "⚠ Setup complete with $WARNINGS warning(s)"
    echo ""
    echo "Your setup is functional but could be improved."
    echo "Review warnings above for optional enhancements."
    echo -e "${NC}"
    echo ""
    echo -e "${YELLOW}You can proceed with:${NC}"
    echo "  docker build -t mindlens:local ."
    echo ""
else
    echo -e "${RED}"
    echo "✗ Setup incomplete: $ERRORS error(s), $WARNINGS warning(s)"
    echo ""
    echo "Please fix the errors above before proceeding."
    echo -e "${NC}"
    exit 1
fi
