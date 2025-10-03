#!/bin/bash

echo "🚀 Starting Urlaubsplanner Backend..."
echo "=================================="

cd backend

echo "📦 Building with Maven..."
mvn clean install

echo "🏃 Running Spring Boot application..."
mvn spring-boot:run
