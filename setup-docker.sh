#!/bin/bash

# AgroAssist Docker Setup Script
# This script helps you set up and run the AgroAssist project with Docker

set -e

echo "================================================"
echo "   AgroAssist Docker Setup Script"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✓ Docker and Docker Compose are installed${NC}"
echo ""

# Function to display menu
show_menu() {
    echo "Select an option:"
    echo "1. Build and start all services"
    echo "2. Start services (without rebuilding)"
    echo "3. Stop all services"
    echo "4. View logs"
    echo "5. Clean up (remove containers and volumes)"
    echo "6. Check service health"
    echo "7. Setup production environment"
    echo "8. Exit"
    echo ""
}

# Function to build and start services
build_and_start() {
    echo -e "${YELLOW}Building and starting all services...${NC}"
    docker-compose up -d --build
    echo -e "${GREEN}✓ All services are starting${NC}"
    echo ""
    echo "Access the application at:"
    echo "  - Frontend: http://localhost"
    echo "  - Backend API: http://localhost:3000"
    echo "  - Crop Recommendation: http://localhost:5000"
    echo "  - Disease Detection: http://localhost:8000"
    echo ""
}

# Function to start services
start_services() {
    echo -e "${YELLOW}Starting all services...${NC}"
    docker-compose up -d
    echo -e "${GREEN}✓ All services started${NC}"
}

# Function to stop services
stop_services() {
    echo -e "${YELLOW}Stopping all services...${NC}"
    docker-compose down
    echo -e "${GREEN}✓ All services stopped${NC}"
}

# Function to view logs
view_logs() {
    echo "Select service to view logs:"
    echo "1. All services"
    echo "2. Backend"
    echo "3. Frontend"
    echo "4. Crop Recommendation"
    echo "5. Disease Detection"
    echo "6. MongoDB"
    read -p "Enter choice: " log_choice
    
    case $log_choice in
        1) docker-compose logs -f ;;
        2) docker-compose logs -f backend ;;
        3) docker-compose logs -f frontend ;;
        4) docker-compose logs -f crop-recommendation ;;
        5) docker-compose logs -f disease-detection ;;
        6) docker-compose logs -f mongodb ;;
        *) echo -e "${RED}Invalid choice${NC}" ;;
    esac
}

# Function to clean up
cleanup() {
    echo -e "${RED}Warning: This will remove all containers and volumes!${NC}"
    read -p "Are you sure? (yes/no): " confirm
    
    if [ "$confirm" = "yes" ]; then
        echo -e "${YELLOW}Cleaning up...${NC}"
        docker-compose down -v
        echo -e "${GREEN}✓ Cleanup complete${NC}"
    else
        echo "Cleanup cancelled"
    fi
}

# Function to check service health
check_health() {
    echo -e "${YELLOW}Checking service health...${NC}"
    echo ""
    
    services=("backend:3000" "crop-recommendation:5000" "disease-detection:8000")
    
    for service in "${services[@]}"; do
        IFS=':' read -r name port <<< "$service"
        echo -n "Checking $name... "
        
        if curl -s "http://localhost:$port/health" > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Healthy${NC}"
        else
            echo -e "${RED}✗ Unhealthy${NC}"
        fi
    done
    
    echo ""
}

# Function to setup production environment
setup_production() {
    echo -e "${YELLOW}Setting up production environment...${NC}"
    
    if [ ! -f .env ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ Created .env file${NC}"
        echo -e "${YELLOW}Please edit .env file with your production credentials${NC}"
        read -p "Press enter when ready to continue..."
    fi
    
    echo -e "${YELLOW}Starting production deployment...${NC}"
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
    echo -e "${GREEN}✓ Production deployment complete${NC}"
}

# Main loop
while true; do
    show_menu
    read -p "Enter your choice: " choice
    echo ""
    
    case $choice in
        1) build_and_start ;;
        2) start_services ;;
        3) stop_services ;;
        4) view_logs ;;
        5) cleanup ;;
        6) check_health ;;
        7) setup_production ;;
        8) echo "Goodbye!"; exit 0 ;;
        *) echo -e "${RED}Invalid choice. Please try again.${NC}" ;;
    esac
    
    echo ""
    read -p "Press enter to continue..."
    echo ""
done
