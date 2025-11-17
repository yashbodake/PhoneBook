# Makefile for Phonebook Application Docker Operations

.PHONY: help build up down logs shell-db shell-backend shell-frontend

# Show help message
help:
	@echo "Phonebook Application Docker Commands"
	@echo ""
	@echo "Usage:"
	@echo "  make build     - Build all Docker images"
	@echo "  make up        - Start all services in detached mode"
	@echo "  make down      - Stop all services"
	@echo "  make logs      - View logs from all services"
	@echo "  make shell-db  - Access PostgreSQL database shell"
	@echo "  make shell-backend  - Access backend container shell"
	@echo "  make shell-frontend - Access frontend container shell"
	@echo ""

# Build all Docker images
build:
	docker-compose build

# Start all services in detached mode
up:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# Stop all services including volumes
down-v:
	docker-compose down -v

# View logs from all services
logs:
	docker-compose logs -f

# View backend logs
logs-backend:
	docker-compose logs -f backend

# View frontend logs
logs-frontend:
	docker-compose logs -f frontend

# Access PostgreSQL database shell
shell-db:
	docker-compose exec db psql -U phonebook_user -d phonebook_db

# Access backend container shell
shell-backend:
	docker-compose exec backend sh

# Access frontend container shell
shell-frontend:
	docker-compose exec frontend sh

# Run tests (if available)
test:
	@echo "Running backend tests..."
	docker-compose exec backend python -m pytest

# View service status
status:
	docker-compose ps

# Restart all services
restart:
	docker-compose restart

# Pull latest images
pull:
	docker-compose pull

# Clean up (remove containers, networks, and volumes)
clean:
	docker-compose down -v
	docker system prune -f