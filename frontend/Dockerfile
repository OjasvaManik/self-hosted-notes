# Stage 1: Install & Build
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN bun run build

# Stage 2: Tiny Production Runner
FROM oven/bun:1-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Only copy the tiny "standalone" folder and static assets
# This IGNORES the 1GB node_modules folder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
# Run the optimized server entry point
CMD ["bun", "run", "server.js"]