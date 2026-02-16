# Stage 1: Build using the Wrapper
# Use JDK image, not Gradle image, so we can use your project's specific gradle version
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# 1. Copy the wrapper script and config first
COPY gradlew ./
COPY gradle ./gradle

# 2. Copy build files
COPY build.gradle.kts settings.gradle.kts ./

# 3. Give execution permission to the wrapper
RUN chmod +x gradlew

# 4. Copy source code
COPY src ./src

# 5. Build using the WRAPPER (./gradlew)
# This downloads the exact Gradle version your project needs (fixing the 8.6 vs 8.12 error)
RUN ./gradlew bootJar -x test --no-daemon

# --- Stage 2: Run the App ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# ------------------------------------------------------
# CRITICAL: Install FFmpeg for your FileService
# ------------------------------------------------------
RUN apk add --no-cache ffmpeg

# Copy the built JAR
COPY --from=builder /app/build/libs/*.jar app.jar

# Ensure upload directory exists
RUN mkdir -p /app/uploads

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]