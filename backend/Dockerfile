# Use a standard JDK image instead of a specific Gradle image
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# 1. Copy the wrapper script and config
COPY gradlew ./
COPY gradle ./gradle

# 2. Copy build files
COPY build.gradle.kts settings.gradle.kts ./

# 3. Make the wrapper executable
RUN chmod +x gradlew

# 4. Copy source code
COPY src ./src

# 5. Build using the WRAPPER (./gradlew) instead of 'gradle'
# This automatically downloads the correct Gradle version defined in your project
RUN ./gradlew bootJar -x test --no-daemon

# --- Stage 2 remains the same ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
RUN mkdir -p /app/uploads
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
