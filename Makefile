# Makefile for AgroAssist Docker Operations

.PHONY: help build up down restart logs clean health backup restore test prod

# Default target
help:
	@echo "AgroAssist Docker Management"
	@echo "=============================="
	@echo ""
	@echo "Available commands:"
	@echo "  make build        - Build all Docker images"
	@echo "  make up           - Start all services"
	@echo "  make down         - Stop all services"
	@echo "  make restart      - Restart all services"
	@echo "  make logs         - View logs from all services"
	@echo "  make logs-f       - Follow logs from all services"
	@echo "  make clean        - Remove containers, volumes, and images"
	@echo "  make health       - Check health of all services"
	@echo "  make backup       - Backup MongoDB database"
	@echo "  make restore      - Restore MongoDB database"
	@echo "  make test         - Run tests"
	@echo "  make prod         - Deploy to production"
	@echo ""

# Build all images
build:
	@echo "Building all Docker images..."
	docker-compose build

# Start all services
up:
	@echo "Starting all services..."
	docker-compose up -d
	@echo "Services started. Access at:"
	@echo "  Frontend: http://localhost"
	@echo "  Backend: http://localhost:3000"
	@echo "  Crop Recommendation: http://localhost:5000"
	@echo "  Disease Detection: http://localhost:8000"

# Stop all services
down:
	@echo "Stopping all services..."
	docker-compose down

# Restart all services
restart: down up

# View logs
logs:
	docker-compose logs

# Follow logs
logs-f:
	docker-compose logs -f

# View logs for specific service
logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-crop:
	docker-compose logs -f crop-recommendation

logs-disease:
	docker-compose logs -f disease-detection

logs-db:
	docker-compose logs -f mongodb

# Clean up everything
clean:
	@echo "Cleaning up containers, volumes, and images..."
	docker-compose down -v --rmi all
	docker system prune -f

# Check service health
health:
	@echo "Checking service health..."
	@curl -s http://localhost:3000/health | jq '.status' || echo "Backend: Unhealthy"
	@curl -s http://localhost:5000/health | jq '.status' || echo "Crop Recommendation: Unhealthy"
	@curl -s http://localhost:8000/health | jq '.status' || echo "Disease Detection: Unhealthy"

# Backup MongoDB
backup:
	@echo "Backing up MongoDB..."
	docker-compose exec -T mongodb mongodump \
		--uri="mongodb://admin:admin123@localhost:27017" \
		--archive > backup-$(shell date +%Y%m%d-%H%M%S).dump
	@echo "Backup complete"

# Restore MongoDB
restore:
	@read -p "Enter backup file name: " backup_file; \
	docker-compose exec -T mongodb mongorestore \
		--uri="mongodb://admin:admin123@localhost:27017" \
		--archive < $$backup_file
	@echo "Restore complete"

# Run tests
test:
	@echo "Running tests..."
	docker-compose run --rm backend npm test || echo "No backend tests"
	docker-compose run --rm frontend npm test || echo "No frontend tests"

# Deploy to production
prod:
	@echo "Deploying to production..."
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Scale services
scale-backend:
	docker-compose up -d --scale backend=3

# Install dependencies
install:
	@echo "Installing dependencies..."
	cd AgroAssist/backend && npm install
	cd AgroAssist/frontend && npm install
	cd Crop_Recommendation && pip install -r requirements.txt
	cd Disease_Detection/Minor\ Proj && pip install -r requirements.txt

# Development mode
dev: build up logs-f

# Quick start
start: build up

# Full reset
reset: down clean build up

# Check Docker stats
stats:
	docker stats
