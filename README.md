# 🌾 AgroAssist - ML-Powered Crop Recommendation System with CI/CD

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)
[![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-D24939?logo=jenkins)](https://www.jenkins.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A comprehensive full-stack agricultural management system with AI-powered crop recommendation and disease detection capabilities. Fully containerized with Docker and automated CI/CD using Jenkins.

## 🚀 Features

- **🌱 ML Crop Recommendation**: 99.32% accuracy crop suggestions based on soil and environmental parameters
- **🔬 Disease Detection**: Deep learning model for plant disease identification from images
- **👥 User Management**: Role-based access control (Admin, Agronomist, Farmer)
- **📊 Data Analytics**: Sensor data collection and analysis
- **🐳 Fully Containerized**: All services run in Docker containers
- **🔄 CI/CD Pipeline**: Automated builds and deployments with Jenkins
- **📱 Responsive UI**: Modern React-based frontend with Tailwind CSS

## 🏗️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React, Vite, Tailwind CSS |
| **Backend** | Node.js, Express, MongoDB |
| **ML Services** | Python, Flask, TensorFlow, Scikit-learn |
| **Database** | MongoDB 7.0 |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | Jenkins Pipeline |

## 📋 Prerequisites

- Docker Desktop 20.10+
- Docker Compose 2.0+
- Git
- 8GB RAM minimum
- 20GB free disk space

## 🎯 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ChandrakanthCherukuri/Ml-crop-recommender-ci-cd.git
cd Ml-crop-recommender-ci-cd
```

### 2. Setup Environment Variables

**For Backend:**
```bash
cd AgroAssist/backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

**Required Environment Variables:**
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: Generate using: `node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"`

### 3. Run with Docker (Recommended)

```bash
# Build and start all services
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Run Without Docker

**Backend:**
```bash
cd AgroAssist/backend
npm install
npm run dev
```

**Frontend:**
```bash
cd AgroAssist/frontend
npm install
npm run dev
```

**Crop Recommendation:**
```bash
cd Crop_Recommendation
pip install -r requirements.txt
python app.py
```

## 🌐 Access the Application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Main application UI |
| **Backend API** | http://localhost:3000 | REST API endpoints |
| **Crop API** | http://localhost:5000 | ML crop prediction |

## 📚 Documentation

- [Docker & Jenkins Guide](DOCKER_JENKINS_GUIDE.md) - Complete containerization guide
- [Jenkins Setup](JENKINS_SETUP.md) - CI/CD pipeline configuration
- [Quick Start Guide](QUICKSTART.md) - Get running in 5 minutes

## 🔄 CI/CD Pipeline

The Jenkins pipeline includes automated builds, tests, security scanning, and deployments.

See [JENKINS_SETUP.md](JENKINS_SETUP.md) for configuration details.

## 🔐 Security

- ⚠️ **Never commit `.env` files to git**
- ✅ Use environment variables for sensitive data
- ✅ Change default passwords in production
- ✅ Generate secure JWT secrets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For issues: [GitHub Issues](https://github.com/ChandrakanthCherukuri/Ml-crop-recommender-ci-cd/issues)

---

**Built with ❤️ for modern agriculture**

A comprehensive full-stack agricultural management system with AI-powered crop recommendation and disease detection capabilities, fully containerized with Docker and automated CI/CD using Jenkins.

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)
[![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-D24939?logo=jenkins)](https://www.jenkins.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🚀 Features

- **🌱 Crop Recommendation System**: ML-powered crop suggestions based on soil and environmental parameters
- **🔬 Disease Detection**: Deep learning model for plant disease identification from images
- **👥 User Management**: Role-based access control (Admin, Agronomist, Farmer)
- **📊 Data Analytics**: Sensor data collection and analysis
- **🐳 Fully Containerized**: All services run in Docker containers
- **🔄 CI/CD Pipeline**: Automated builds and deployments with Jenkins
- **📱 Responsive UI**: Modern React-based frontend with Tailwind CSS

## 🏗️ Architecture

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React, Vite, Tailwind CSS, Axios |
| **Backend** | Node.js, Express, MongoDB, JWT |
| **ML Services** | Python, Flask, TensorFlow, Scikit-learn |
| **Database** | MongoDB 7.0 |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | Jenkins Pipeline |
| **Web Server** | Nginx (for production) |

### Services

```
├── Frontend (React + Nginx) - Port 80
├── Backend (Node.js + Express) - Port 3000
├── Crop Recommendation (Flask + ML) - Port 5000
├── Disease Detection (Flask + TensorFlow) - Port 8000
└── MongoDB - Port 27017
```

## 📋 Prerequisites

- **Docker Desktop** 20.10+ ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose** 2.0+ (included with Docker Desktop)
- **Git** for version control
- **8GB RAM** minimum
- **20GB** free disk space

## 🎯 Quick Start

### Option 1: Automated Setup (Recommended)

**Windows:**
```powershell
.\setup-docker.bat
```

**Linux/Mac:**
```bash
chmod +x setup-docker.sh
./setup-docker.sh
```

### Option 2: Manual Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd AgroAssist

# Start all services
docker-compose up -d --build

# Check status
docker-compose ps
```

### Access the Application

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost | - |
| **Backend API** | http://localhost:3000 | - |
| **Crop API** | http://localhost:5000 | - |
| **Disease API** | http://localhost:8000 | - |
| **MongoDB** | localhost:27017 | admin/admin123 |

## 📖 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get up and running in 5 minutes
- **[Docker & Jenkins Guide](DOCKER_JENKINS_GUIDE.md)** - Complete containerization guide
- **[Jenkins Setup](JENKINS_SETUP.md)** - CI/CD pipeline configuration

## 🔧 Development

### Project Structure

```
AgroAssist/
├── AgroAssist/
│   ├── backend/              # Node.js backend service
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   └── frontend/             # React frontend application
│       ├── src/
│       ├── Dockerfile
│       ├── nginx.conf
│       └── package.json
├── Crop_Recommendation/      # ML crop recommendation service
│   ├── models/
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
├── Disease_Detection/        # ML disease detection service
│   └── Minor Proj/
│       ├── models/
│       ├── app.py
│       ├── Dockerfile
│       └── requirements.txt
├── docker-compose.yml        # Main Docker Compose configuration
├── docker-compose.prod.yml   # Production overrides
├── Jenkinsfile              # CI/CD pipeline definition
├── Makefile                 # Helper commands
└── README.md               # This file
```

### Local Development (Without Docker)

**Backend:**
```bash
cd AgroAssist/backend
npm install
npm run dev
```

**Frontend:**
```bash
cd AgroAssist/frontend
npm install
npm run dev
```

**Crop Recommendation:**
```bash
cd Crop_Recommendation
pip install -r requirements.txt
python app.py
```

**Disease Detection:**
```bash
cd Disease_Detection/Minor\ Proj
pip install -r requirements.txt
python app.py
```

## 🔄 CI/CD with Jenkins

### Pipeline Stages

1. ✅ **Checkout** - Clone repository
2. 🔧 **Build** - Build all Docker images
3. 🧪 **Test** - Run unit and integration tests
4. 🔍 **Security Scan** - Vulnerability scanning with Trivy
5. 📦 **Push** - Push images to registry (main branch)
6. 🚀 **Deploy** - Deploy to environment

### Setup Jenkins

```bash
# Start Jenkins
docker run -d -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --name jenkins jenkins/jenkins:lts

# Get initial password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

See [JENKINS_SETUP.md](JENKINS_SETUP.md) for complete configuration.

## 🐳 Docker Commands

```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart a service
docker-compose restart backend

# Scale a service
docker-compose up -d --scale backend=3

# Check health
curl http://localhost:3000/health
curl http://localhost:5000/health
curl http://localhost:8000/health
```

## 🧪 Testing

```bash
# Run all tests
docker-compose run --rm backend npm test
docker-compose run --rm frontend npm test

# Run with coverage
docker-compose run --rm backend npm run test:coverage
```

## 📊 Monitoring

### Health Checks

```bash
# Backend
curl http://localhost:3000/health

# Crop Recommendation
curl http://localhost:5000/health

# Disease Detection
curl http://localhost:8000/health
```

### Container Stats

```bash
# Real-time resource usage
docker stats

# View logs
docker-compose logs -f [service-name]
```

## 🔐 Security

- ✅ Health checks for all services
- ✅ Vulnerability scanning in CI/CD
- ✅ Environment-based configuration
- ✅ JWT authentication
- ✅ CORS configuration
- ✅ Non-root Docker users
- ⚠️ **Change default credentials in production!**

## 🚀 Production Deployment

1. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

2. **Deploy:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
   ```

3. **Verify deployment:**
   ```bash
   docker-compose ps
   curl http://your-domain/health
   ```

## 🔍 Troubleshooting

### Common Issues

**Ports already in use:**
```bash
# Windows
netstat -ano | findstr :<port>
# Linux/Mac
lsof -i :<port>
```

**Container won't start:**
```bash
docker-compose logs [service-name]
docker-compose restart [service-name]
```

**Out of disk space:**
```bash
docker system prune -a --volumes
```

**Database connection issues:**
```bash
docker-compose restart mongodb
docker-compose logs mongodb
```

See [DOCKER_JENKINS_GUIDE.md](DOCKER_JENKINS_GUIDE.md) for detailed troubleshooting.

## 📈 API Endpoints

### Backend API
- `GET /health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/sensor-data` - Sensor data retrieval
- More endpoints in backend documentation

### Crop Recommendation API
- `GET /health` - Health check
- `POST /predict` - Crop prediction
- `GET /sample-test` - Test endpoint

### Disease Detection API
- `GET /health` - Health check
- `POST /predict` - Disease detection from image

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend Development** - Node.js, Express, MongoDB
- **Frontend Development** - React, Tailwind CSS
- **ML Engineering** - TensorFlow, Scikit-learn
- **DevOps** - Docker, Jenkins, CI/CD

## 🙏 Acknowledgments

- TensorFlow team for deep learning framework
- Scikit-learn for ML algorithms
- Docker for containerization
- Jenkins for CI/CD automation

## 📞 Support

For issues and questions:
- 📧 Email: support@agroassist.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 📚 Docs: See documentation folder

## 🗺️ Roadmap

- [ ] Kubernetes deployment
- [ ] Real-time sensor data streaming
- [ ] Mobile application
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Weather API integration

---

**Built with ❤️ for modern agriculture**

*Empowering farmers with AI and technology*
