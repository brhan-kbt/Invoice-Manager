FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Add libc6-compat for compatibility
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies using npm ci
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry if needed
# ENV NEXT_TELEMETRY_DISABLED 1

# Run the build script
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

# Create system group and user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions for .next folder
RUN chown nextjs:nodejs .next

# Use the non-root user
USER nextjs

# Expose the application port
EXPOSE 3000

# Set PORT environment variable
ENV PORT 3000

# Run the application
CMD HOSTNAME="0.0.0.0" node server.js
