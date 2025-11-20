# 🚀 Setup Instructions for New Contributors

## Step-by-Step Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/ChandrakanthCherukuri/Ml-crop-recommender-ci-cd.git
cd Ml-crop-recommender-ci-cd
```

### 2. Setup Backend Environment

```bash
# Navigate to backend
cd AgroAssist/backend

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Use your favorite editor (notepad, vim, nano, VS Code)
```

**Required Configuration in `.env`:**

```env
PORT=3000
MONGO_URI=your_mongodb_uri_here
JWT_SECRET=your_generated_secret_here
FRONTEND_URL=http://localhost:5173
```

### 3. Generate JWT Secret

Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

Copy the output and paste it as your `JWT_SECRET` in `.env`.

### 4. Setup MongoDB

#### Option A: MongoDB Atlas (Recommended for beginners)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new cluster (choose Free Tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Use this as your `MONGO_URI`

#### Option B: Local MongoDB

```bash
# Install MongoDB locally
# Then use:
MONGO_URI=mongodb://localhost:27017/agroassist
```

### 5. Install Dependencies

#### Backend
```bash
cd AgroAssist/backend
npm install
```

#### Frontend
```bash
cd AgroAssist/frontend
npm install
```

#### Crop Recommendation
```bash
cd Crop_Recommendation
pip install -r requirements.txt
```

### 6. Start the Application

#### Option A: Run All Services (Without Docker)

Open 3 separate terminals:

**Terminal 1 - Backend:**
```bash
cd AgroAssist/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd AgroAssist/frontend
npm run dev
```

**Terminal 3 - Crop Recommendation:**
```bash
cd Crop_Recommendation
python app.py
```

#### Option B: Run with Docker

```bash
# Make sure Docker Desktop is running

# Create .env for Docker
cp .env.example .env
# Edit .env with your settings

# Start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 7. Access the Application

Open your browser and go to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Crop API**: http://localhost:5000

### 8. Verify Everything Works

Test the health endpoints:

```bash
# Backend
curl http://localhost:3000/health

# Crop Recommendation
curl http://localhost:5000/health
```

You should see JSON responses indicating the services are healthy.

## 📋 Troubleshooting

### Problem: "Cannot connect to MongoDB"

**Solution:**
- Check your `MONGO_URI` in `.env`
- Verify MongoDB is running (if using local)
- Check your MongoDB Atlas IP whitelist (add 0.0.0.0/0 for testing)
- Verify credentials are correct

### Problem: "Port already in use"

**Solution:**
```bash
# Windows - Find process using port 3000
netstat -ano | findstr :3000
# Kill the process
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Problem: "Module not found"

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For Python
pip install -r requirements.txt --force-reinstall
```

### Problem: Docker won't start

**Solution:**
- Make sure Docker Desktop is running
- Check if ports are available (3000, 5173, 5000, 27017)
- Try: `docker-compose down -v` then start again

## 🔐 Security Reminders

1. **NEVER commit `.env` files**
2. **NEVER share your JWT_SECRET**
3. **NEVER share your MongoDB credentials**
4. **Always use environment variables for secrets**

See [SECURITY.md](SECURITY.md) for detailed security guidelines.

## 📚 Additional Resources

- [Docker Guide](DOCKER_JENKINS_GUIDE.md)
- [Jenkins Setup](JENKINS_SETUP.md)
- [Quick Start](QUICKSTART.md)
- [Main README](README.md)

## 🆘 Getting Help

If you run into issues:

1. Check the [SECURITY.md](SECURITY.md) for environment setup
2. Review error messages carefully
3. Check logs: `docker-compose logs -f` or terminal output
4. Create an issue on GitHub with:
   - What you were trying to do
   - What happened instead
   - Error messages (remove any sensitive data!)
   - Your operating system

## 🎉 Success!

If everything is running, you should see:
- ✅ Backend running on http://localhost:3000
- ✅ Frontend running on http://localhost:5173
- ✅ Crop API running on http://localhost:5000
- ✅ MongoDB connected successfully

Now you're ready to start developing! 🚀

---

**Happy Coding!** 💻
