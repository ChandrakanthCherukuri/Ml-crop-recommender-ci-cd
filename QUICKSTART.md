# AgroAssist - Quick Start Guide

## 🚀 Quick Start with Docker

### Prerequisites
- Docker Desktop installed and running
- 8GB RAM minimum
- 20GB free disk space

### Start the Application (Windows)

**Option 1: Using the Setup Script**
```powershell
.\setup-docker.bat
```
Then select option 1 to build and start all services.

**Option 2: Using Docker Compose**
```powershell
docker-compose up -d --build
```

### Start the Application (Linux/Mac)

**Option 1: Using the Setup Script**
```bash
chmod +x setup-docker.sh
./setup-docker.sh
```

**Option 2: Using Makefile**
```bash
make start
```

**Option 3: Using Docker Compose**
```bash
docker-compose up -d --build
```

### Access the Application

After starting, access these URLs:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost | Main application UI |
| **Backend API** | http://localhost:3000 | REST API |
| **Crop Recommendation** | http://localhost:5000 | ML crop prediction |
| **Disease Detection** | http://localhost:8000 | ML disease detection |
| **MongoDB** | localhost:27017 | Database |

### Check Service Health

```bash
# Windows
curl http://localhost:3000/health
curl http://localhost:5000/health
curl http://localhost:8000/health

# Or use the setup script and select option 6
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f crop-recommendation
docker-compose logs -f disease-detection
```

### Stop the Application

```bash
docker-compose down
```

### Complete Cleanup (removes all data)

```bash
docker-compose down -v
```

## 🔧 Common Commands

### Docker Compose Commands

```bash
# Build images
docker-compose build

# Start in foreground (see logs)
docker-compose up

# Start in background
docker-compose up -d

# Rebuild and start
docker-compose up -d --build

# Stop services
docker-compose down

# Restart a service
docker-compose restart backend

# View running containers
docker-compose ps

# Execute command in container
docker-compose exec backend sh
docker-compose exec mongodb mongosh
```

### Makefile Commands (Linux/Mac)

```bash
make help          # Show all commands
make build         # Build all images
make up            # Start all services
make down          # Stop all services
make restart       # Restart all services
make logs          # View logs
make logs-f        # Follow logs
make health        # Check health
make clean         # Full cleanup
make backup        # Backup database
make prod          # Production deployment
```

## 🏗️ Jenkins CI/CD Setup

### 1. Start Jenkins

```bash
docker run -d -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --name jenkins \
  jenkins/jenkins:lts
```

### 2. Get Initial Password

```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### 3. Access Jenkins

Open http://localhost:8080 and follow setup wizard

### 4. Configure Pipeline

1. Install required plugins:
   - Docker Pipeline
   - Git
   - Credentials Binding

2. Add Docker Hub credentials:
   - ID: `docker-hub-credentials`
   - Username: Your Docker Hub username
   - Password: Docker Hub token

3. Create new Pipeline job:
   - Repository URL: Your Git repo
   - Script Path: `Jenkinsfile`

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Nginx (Frontend)                  │
│                    Port: 80                          │
└──────────────┬──────────────────────────────────────┘
               │
               ├──────────────────┬───────────────────┐
               │                  │                   │
┌──────────────▼─────┐  ┌─────────▼───────┐  ┌───────▼─────────┐
│  Backend           │  │  Crop Rec.      │  │  Disease Det.   │
│  Node.js:3000      │  │  Flask:5000     │  │  Flask:8000     │
└──────────────┬─────┘  └─────────────────┘  └─────────────────┘
               │
               │
┌──────────────▼─────┐
│  MongoDB:27017     │
└────────────────────┘
```

## 🔐 Production Deployment

### 1. Setup Environment

```bash
cp .env.example .env
# Edit .env with production credentials
```

### 2. Deploy

```bash
# Using Makefile
make prod

# Using Docker Compose
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Windows - Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Check container status
docker ps -a

# Remove and recreate
docker-compose rm backend
docker-compose up -d backend
```

### Out of Disk Space

```bash
# Clean up Docker
docker system prune -a --volumes

# Check disk usage
docker system df
```

### Database Connection Failed

```bash
# Check MongoDB is running
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

## 📚 Documentation

- **Full Docker Guide**: See `DOCKER_JENKINS_GUIDE.md`
- **Jenkins Setup**: See `JENKINS_SETUP.md`
- **API Documentation**: Access `/api/docs` when backend is running

## 🆘 Support

For issues:
1. Check logs: `docker-compose logs -f`
2. Verify all containers are running: `docker-compose ps`
3. Check health endpoints
4. Review documentation

## 📝 Notes

- Default MongoDB credentials: admin/admin123 (change in production!)
- Frontend proxies API requests to backend
- ML models are loaded on container startup
- Health checks run every 30 seconds
- Logs are stored in named volumes

---

**Happy Coding! 🌾**
