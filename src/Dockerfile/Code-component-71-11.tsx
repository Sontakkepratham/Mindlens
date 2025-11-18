# ========================================
# MindLens - Production Dockerfile for Google Cloud Run
# ========================================
# 
# This Dockerfile builds a production-ready container for the MindLens
# mental health screening platform frontend application.
#
# Build: docker build -t mindlens .
# Run locally: docker run -p 8080:8080 mindlens
# Deploy to GCR: gcloud run deploy mindlens --source .
#

# ========================================
# Stage 1: Build Stage
# ========================================
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ========================================
# Stage 2: Production Stage
# ========================================
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Install serve to run the static files
RUN npm install -g serve

# Copy built assets from builder stage
COPY --from=builder /app/dist /app/dist

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port 8080 (Cloud Run requirement)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
# Use single-page-application mode for React Router compatibility
CMD ["serve", "-s", "dist", "-l", "8080"]
