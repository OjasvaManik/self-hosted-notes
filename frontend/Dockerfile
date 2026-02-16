FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Build
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN bun run build

# Run
EXPOSE 3000
CMD ["bun", "run", "start"]