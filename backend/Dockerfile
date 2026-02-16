FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# 1. Copy Gradle wrapper (Cached indefinitely)
COPY gradlew ./
COPY gradle ./gradle
RUN chmod +x gradlew

# 2. Copy Build Config (Cached unless dependencies change)
COPY build.gradle.kts settings.gradle.kts ./

# 3. THE MAGIC STEP: Download dependencies NOW
# Since source code isn't copied yet, this layer is CACHED.
# Docker will skip this step instantly on future builds.
RUN ./gradlew dependencies --no-daemon

# 4. Copy Source Code (This changes often)
COPY src ./src

# 5. Build (Only compiles code, doesn't re-download internet)
RUN ./gradlew bootJar -x test --no-daemon

# --- Stage 2 (Run) ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN apk add --no-cache ffmpeg
COPY --from=builder /app/build/libs/*.jar app.jar
RUN mkdir -p /app/uploads
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]