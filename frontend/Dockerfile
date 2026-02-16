FROM oven/bun:1 AS base
WORKDIR /app

# 1. Copy Dependency Manifests (Cached)
COPY package.json bun.lock ./

# 2. Install Dependencies (Cached unless package.json changes)
RUN bun install --frozen-lockfile

# 3. Copy Source Code
COPY . .

# 4. Build the App
# We disable telemetry to speed up the build slightly
ENV NEXT_TELEMETRY_DISABLED 1
RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "start"]