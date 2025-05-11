# Use Java 21 as the base image
FROM eclipse-temurin:21-jdk-alpine

# Set working directory
WORKDIR /app

# Copy Maven configuration files
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make the maven wrapper executable
RUN chmod +x ./mvnw

# Download dependencies (this layer can be cached)
RUN ./mvnw dependency:go-offline -B

# Copy application source
COPY src src

# Build the application
RUN ./mvnw package -DskipTests

# Use a smaller runtime image
FROM eclipse-temurin:21-jre-alpine

# Set working directory
WORKDIR /app

# Copy the jar file from the build stage
COPY --from=0 /app/target/todo-backend-1.jar app.jar

# Create directory for uploads
RUN mkdir -p /app/uploads
VOLUME /app/uploads

# Expose the application port
EXPOSE 4000

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]