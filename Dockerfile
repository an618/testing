# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

ARG NODE_ENV
ARG KEYCLOAK_CLIENT_ID
ARG KEYCLOAK_CLIENT_SECRET
ARG KEYCLOAK_ISSUER
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXTAUTH_SECRET

# Set env vars
ENV NODE_ENV=$NODE_ENV \
    KEYCLOAK_CLIENT_ID=$KEYCLOAK_CLIENT_ID \
    KEYCLOAK_CLIENT_SECRET=$KEYCLOAK_CLIENT_SECRET \
    KEYCLOAK_ISSUER=$KEYCLOAK_ISSUER \
    NEXTAUTH_URL=$NEXTAUTH_URL \
    NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXTAUTH_SECRET=$NEXTAUTH_SECRET \
    NEXT_TELEMETRY_DISABLED=1

# Install dependencies only when needed
COPY package.json package-lock.json* ./
RUN npm ci --include=dev

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

ARG NODE_ENV
ARG KEYCLOAK_CLIENT_ID
ARG KEYCLOAK_CLIENT_SECRET
ARG KEYCLOAK_ISSUER
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXTAUTH_SECRET

# Set env vars
ENV NODE_ENV=$NODE_ENV \
    KEYCLOAK_CLIENT_ID=$KEYCLOAK_CLIENT_ID \
    KEYCLOAK_CLIENT_SECRET=$KEYCLOAK_CLIENT_SECRET \
    KEYCLOAK_ISSUER=$KEYCLOAK_ISSUER \
    NEXTAUTH_URL=$NEXTAUTH_URL \
    NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXTAUTH_SECRET=$NEXTAUTH_SECRET \
    NEXT_TELEMETRY_DISABLED=1

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ARG NODE_ENV
ARG KEYCLOAK_CLIENT_ID
ARG KEYCLOAK_CLIENT_SECRET
ARG KEYCLOAK_ISSUER
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXTAUTH_SECRET

# Set env vars
ENV NODE_ENV=$NODE_ENV \
    KEYCLOAK_CLIENT_ID=$KEYCLOAK_CLIENT_ID \
    KEYCLOAK_CLIENT_SECRET=$KEYCLOAK_CLIENT_SECRET \
    KEYCLOAK_ISSUER=$KEYCLOAK_ISSUER \
    NEXTAUTH_URL=$NEXTAUTH_URL \
    NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXTAUTH_SECRET=$NEXTAUTH_SECRET \
    NEXT_TELEMETRY_DISABLED=1

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set proper permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Set the hostname to 0.0.0.0 to allow external connections
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["node", "server.js"] 