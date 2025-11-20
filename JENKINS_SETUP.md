# AgroAssist CI/CD and Deployment

This directory contains CI/CD configuration and deployment scripts for the AgroAssist project.

## Jenkins Pipeline

The `Jenkinsfile` in the root directory defines the complete CI/CD pipeline with the following stages:

1. **Checkout** - Clone the repository
2. **Setup Environment** - Verify Docker and Docker Compose
3. **Build Services** - Build all Docker images (Backend, Frontend, ML Services)
4. **Run Tests** - Execute unit and integration tests
5. **Security Scan** - Scan images for vulnerabilities using Trivy
6. **Push to Registry** - Push images to Docker Hub (main branch only)
7. **Deploy** - Deploy to development or production environments

## Setting Up Jenkins

### Option 1: Jenkins in Docker

```bash
# Run Jenkins in Docker
docker run -d -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --name jenkins \
  jenkins/jenkins:lts

# Get initial admin password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### Option 2: Jenkins with Docker Compose

Create `jenkins/docker-compose.yml`:

```yaml
version: '3.8'
services:
  jenkins:
    image: jenkins/jenkins:lts
    privileged: true
    user: root
    ports:
      - 8080:8080
      - 50000:50000
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - DOCKER_HOST=unix:///var/run/docker.sock

volumes:
  jenkins_home:
```

## Required Jenkins Plugins

Install these plugins in Jenkins:

1. Docker Pipeline
2. Docker Commons
3. Git
4. Pipeline
5. Credentials Binding
6. Blue Ocean (optional, for better UI)

## Credentials Setup

Add these credentials in Jenkins:

1. **Docker Hub Credentials**
   - ID: `docker-hub-credentials`
   - Type: Username with password
   - Username: Your Docker Hub username
   - Password: Docker Hub access token

2. **GitHub/GitLab Token** (if using private repo)
   - ID: `github-token`
   - Type: Secret text
   - Secret: Your GitHub personal access token

## Pipeline Configuration

1. Create a new Pipeline job in Jenkins
2. Configure SCM:
   - Repository URL: Your Git repository URL
   - Credentials: Select appropriate credentials
   - Branch: `*/main` or `*/develop`
3. Script Path: `Jenkinsfile`
4. Enable "Build Triggers" → "GitHub hook trigger" (for webhooks)

## Environment Variables

Configure these in Jenkins or in the Jenkinsfile:

- `DOCKER_REGISTRY`: Docker registry URL (default: docker.io)
- `PROJECT_NAME`: Project name (default: agroassist)
- `DOCKER_CREDENTIALS`: Jenkins credentials ID for Docker Hub

## Branch Strategy

- **main**: Production deployments (manual approval required)
- **develop**: Automatic deployment to development environment
- **feature/***: Build and test only

## Deployment Environments

### Development
- Auto-deploys on push to `develop` branch
- Uses `docker-compose.yml`

### Production
- Requires manual approval
- Uses `docker-compose.yml` + `docker-compose.prod.yml`
- Triggered on push to `main` branch

## Monitoring Build Status

Access Jenkins at: `http://localhost:8080`

View pipeline:
- Classic UI: Go to job → Build History
- Blue Ocean: Click "Open Blue Ocean" for modern interface

## Troubleshooting

### Docker Socket Permission Issues

```bash
# Add Jenkins user to docker group
docker exec -u root jenkins usermod -aG docker jenkins
docker restart jenkins
```

### Build Failures

1. Check logs in Jenkins console output
2. Verify Docker daemon is running
3. Ensure credentials are configured correctly
4. Check disk space: `docker system df`

### Cleaning Up

```bash
# Clean Docker resources
docker system prune -a --volumes

# Remove Jenkins container
docker rm -f jenkins

# Remove Jenkins volume
docker volume rm jenkins_home
```

## Manual Deployment

If Jenkins is not available, deploy manually:

```bash
# Build and deploy
docker-compose build
docker-compose up -d

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Notifications

Configure notifications in the `post` section of Jenkinsfile:

- Email notifications
- Slack integration
- Microsoft Teams webhooks

Example Slack notification:

```groovy
post {
    success {
        slackSend(
            color: 'good',
            message: "Build Successful: ${env.JOB_NAME} - ${env.BUILD_NUMBER}"
        )
    }
}
```

## Security Best Practices

1. Use Jenkins credentials for sensitive data
2. Scan images for vulnerabilities (Trivy included in pipeline)
3. Use least privilege for Jenkins user
4. Enable CSRF protection
5. Configure matrix-based security
6. Regular Jenkins updates

## Resources

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Jenkins Docker Plugin](https://plugins.jenkins.io/docker-plugin/)
- [Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
