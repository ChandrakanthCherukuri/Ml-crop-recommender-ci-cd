# AgroAssist - Docker & Jenkins Deployment Guide

## 🐳 Docker Integration

This project is fully containerized using Docker and orchestrated with Docker Compose. All services (Backend, Frontend, Crop Recommendation, and Disease Detection) can be run in isolated containers.

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 8GB RAM minimum
- 20GB free disk space

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd AgroAssist
   ```

2. **Build and run all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:3000
   - Crop Recommendation API: http://localhost:5000
   - Disease Detection API: http://localhost:8000
   - MongoDB: localhost:27017

### Docker Commands

```bash
# Build all services
docker-compose build

# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend

# Stop all services
docker-compose down

# Stop and remove volumes (careful: deletes data)
docker-compose down -v

# Restart a specific service
docker-compose restart backend

# Scale a service (example: 3 backend instances)
docker-compose up -d --scale backend=3
```

### Individual Service Commands

```bash
# Build individual service
docker-compose build backend

# Run specific service
docker-compose up backend

# Execute command in running container
docker-compose exec backend sh
docker-compose exec mongodb mongosh
```

## 🏗️ Architecture

### Services Overview

| Service | Port | Technology | Purpose |
|---------|------|------------|---------|
| Frontend | 80 | React + Nginx | User interface |
| Backend | 3000 | Node.js + Express | REST API |
| Crop Recommendation | 5000 | Flask + ML | Crop prediction |
| Disease Detection | 8000 | Flask + TensorFlow | Disease identification |
| MongoDB | 27017 | MongoDB 7.0 | Database |

### Network Architecture

All services are connected via a Docker bridge network (`agroassist-network`) allowing inter-service communication using service names as hostnames.

### Volume Mounts

- `mongodb_data`: Persistent MongoDB data
- `mongodb_config`: MongoDB configuration
- Model files are mounted from host to containers
- Upload directories are persisted

## 🔧 Production Deployment

### Environment Configuration

1. **Copy environment template**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file with production values**
   ```env
   MONGO_ROOT_USERNAME=admin
   MONGO_ROOT_PASSWORD=your-secure-password
   MONGODB_URI=mongodb://admin:your-secure-password@mongodb:27017/agroassist?authSource=admin
   JWT_SECRET=your-jwt-secret-key
   ```

3. **Deploy with production configuration**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

### Security Best Practices

- Change default MongoDB credentials
- Use strong JWT secrets
- Enable SSL/TLS for production
- Use secrets management (Docker Secrets, HashiCorp Vault)
- Implement rate limiting
- Regular security updates

## 🚀 Jenkins CI/CD Integration

### Jenkins Setup

1. **Install Jenkins**
   ```bash
   # Using Docker
   docker run -d -p 8080:8080 -p 50000:50000 \
     -v jenkins_home:/var/jenkins_home \
     -v /var/run/docker.sock:/var/run/docker.sock \
     --name jenkins \
     jenkins/jenkins:lts
   ```

2. **Access Jenkins**
   - URL: http://localhost:8080
   - Get initial password: `docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword`

3. **Install Required Plugins**
   - Docker Pipeline
   - Docker Compose Build Step
   - Git plugin
   - Credentials Binding
   - Pipeline

### Pipeline Configuration

1. **Add Docker Hub Credentials**
   - Navigate to: Jenkins → Credentials → System → Global credentials
   - Add credentials with ID: `docker-hub-credentials`
   - Username: Your Docker Hub username
   - Password: Your Docker Hub token

2. **Create New Pipeline Job**
   - New Item → Pipeline
   - Name: `AgroAssist-CI-CD`
   - Pipeline script from SCM
   - SCM: Git
   - Repository URL: Your repo URL
   - Script Path: `Jenkinsfile`

3. **Configure Webhooks (Optional)**
   - GitHub/GitLab → Repository Settings → Webhooks
   - Add Jenkins webhook URL: `http://your-jenkins-url/github-webhook/`

### Pipeline Stages

The Jenkins pipeline includes:

1. **Checkout**: Clone the repository
2. **Build Backend**: Build Node.js backend Docker image
3. **Build Frontend**: Build React frontend Docker image
4. **Build ML Services**: Build Crop Recommendation and Disease Detection images (parallel)
5. **Run Tests**: Execute unit and integration tests
6. **Security Scan**: Scan images for vulnerabilities using Trivy
7. **Push to Registry**: Push images to Docker Hub (main branch only)
8. **Deploy to Development**: Auto-deploy to dev environment (develop branch)
9. **Deploy to Production**: Manual approval deployment (main branch)

### Pipeline Environment Variables

Configure in Jenkins or Jenkinsfile:

```groovy
DOCKER_REGISTRY = 'docker.io'
PROJECT_NAME = 'agroassist'
```

## 📊 Monitoring and Health Checks

### Health Check Endpoints

Each service includes health check endpoints:

```bash
# Backend
curl http://localhost:3000/health

# Crop Recommendation
curl http://localhost:5000/health

# Disease Detection
curl http://localhost:8000/health
```

### Docker Health Status

```bash
# Check container health
docker ps

# View detailed health check logs
docker inspect --format='{{json .State.Health}}' agroassist-backend
```

### Monitoring with Docker Stats

```bash
# Real-time resource usage
docker stats

# Specific service
docker stats agroassist-backend
```

## 🔍 Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Find process using port
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Linux/Mac

# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Host:Container
```

**2. Container Keeps Restarting**
```bash
# Check logs
docker-compose logs -f backend

# Check container status
docker ps -a
```

**3. MongoDB Connection Issues**
```bash
# Verify MongoDB is running
docker-compose ps mongodb

# Test connection
docker-compose exec mongodb mongosh -u admin -p admin123
```

**4. Out of Disk Space**
```bash
# Clean up unused resources
docker system prune -a --volumes

# Remove specific images
docker rmi $(docker images -q)
```

**5. Build Failures**
```bash
# Clear build cache
docker-compose build --no-cache

# Pull base images
docker-compose pull
```

## 🔄 Updates and Maintenance

### Updating Services

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Update specific service
docker-compose up -d --build backend
```

### Database Backups

```bash
# Backup MongoDB
docker-compose exec -T mongodb mongodump \
  --uri="mongodb://admin:admin123@localhost:27017" \
  --archive > backup.dump

# Restore MongoDB
docker-compose exec -T mongodb mongorestore \
  --uri="mongodb://admin:admin123@localhost:27017" \
  --archive < backup.dump
```

### Logs Management

```bash
# View all logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Limit log lines
docker-compose logs --tail=100

# Save logs to file
docker-compose logs > logs.txt
```

## 📈 Scaling

### Horizontal Scaling

```bash
# Scale backend service
docker-compose up -d --scale backend=3

# Use with load balancer (Nginx, HAProxy)
```

### Load Balancing Configuration

Add Nginx load balancer in `docker-compose.yml`:

```yaml
nginx-lb:
  image: nginx:alpine
  ports:
    - "80:80"
  volumes:
    - ./nginx-lb.conf:/etc/nginx/nginx.conf
  depends_on:
    - backend
```

## 🛡️ Security Considerations

1. **Never commit `.env` files**
2. **Use Docker secrets for sensitive data**
3. **Scan images regularly**: `docker scan agroassist-backend`
4. **Keep base images updated**
5. **Implement network policies**
6. **Use non-root users in containers**
7. **Enable audit logging**

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
- [Best Practices for Writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test locally with Docker
4. Submit pull request
5. Jenkins pipeline will run automatically

## 📝 License

[Your License Here]

## 👥 Support

For issues and questions:
- Open an issue on GitHub
- Contact: [your-email@example.com]

---

**Built with ❤️ for modern agriculture**
