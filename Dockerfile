# Dockerfile for Next.js 15 Standalone Production Deployment

# --- Base Stage ---
# Use a minimal Node.js Alpine image for a small footprint
FROM node:22.14-alpine AS base

# Add necessary system libraries for Node.js
RUN apk add --no-cache libc6-compat

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# --- Builder Stage ---
FROM base AS builder

WORKDIR /app

# Copy package.json and lock file first to leverage Docker cache
# Ensure package-lock.json (or your package manager's lockfile) is present in the root of your project
 # Explicitly copy package.json and package-lock.json

COPY package.json package-lock.json./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Disable Next.js telemetry for production builds
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js application in standalone mode
# Ensure next.config.js has output: 'standalone'
RUN npm run build

# --- Runner Stage (Final Production Image) ---
FROM base AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Switch to the non-root user
USER nextjs

# Copy the standalone output from the builder stage
# The.next/standalone directory contains the minimal server and necessary files
# Crucially, also copy public and.next/static as they are not included by default in standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./ 
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Expose the port Next.js listens on (default is 3000)
EXPOSE 3000

# Set hostname to 0.0.0.0 to listen on all network interfaces
ENV HOSTNAME="0.0.0.0"

# Command to run the Next.js standalone server
CMD ["node", "server.js"]