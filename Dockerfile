# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17-alpine AS build

WORKDIR /app

# Copy Backend directory
COPY Backend/pom.xml .
COPY Backend/src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the JAR from build stage
COPY --from=build /app/target/cafeteria-backend-1.0.0.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-Xmx512m", "-jar", "app.jar", "--spring.profiles.active=prod"]
