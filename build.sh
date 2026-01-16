#!/bin/bash

echo "🔨 Building Cafeteria Backend..."

# Navigate to Backend directory
cd Backend

# Clean and build with Maven
echo "📦 Running Maven clean package..."
./mvnw clean package -DskipTests

# Verify the JAR was created
if [ -f "target/cafeteria-backend-1.0.0.jar" ]; then
    echo "✅ Build successful! JAR created at target/cafeteria-backend-1.0.0.jar"
else
    echo "❌ Build failed! JAR not found."
    exit 1
fi
