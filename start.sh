#!/bin/bash

# Quick start script for the Product CRUD System

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null
then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
fi

# Create images directory if it doesn't exist
if [ ! -d "images" ]; then
    echo "Creating images directory..."
    mkdir -p images
    chmod 755 images
fi

# Start the Docker containers
echo "Starting Docker containers..."
docker-compose up -d

# Show information about how to access the application
echo ""
echo "The Product CRUD System is now running!"
echo "You can access it at: http://localhost:8080"
echo ""
echo "To stop the application, run: docker-compose down"
echo ""

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
sleep 10

# Show the status of the Docker containers
docker-compose ps 