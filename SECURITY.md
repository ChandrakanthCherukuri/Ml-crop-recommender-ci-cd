# 🔐 Security Configuration Guide

## ⚠️ Important Security Notes

### 1. Environment Variables

**NEVER commit these files to Git:**
- `.env`
- `AgroAssist/backend/.env`
- Any file containing passwords, API keys, or secrets

### 2. Required Environment Variables

Create `AgroAssist/backend/.env` with:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_generated_jwt_secret
FRONTEND_URL=http://localhost:5173
```

### 3. Generate Secure JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

Copy the output and use it as your `JWT_SECRET`.

### 4. MongoDB Setup

#### Option 1: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace `username`, `password`, and `cluster` in:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/agroassist?retryWrites=true&w=majority
   ```

#### Option 2: Local MongoDB
```env
MONGO_URI=mongodb://localhost:27017/agroassist
```

### 5. Docker Environment Variables

For Docker deployments, create `.env` in the root directory:

```env
# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_secure_password_here

# Backend
MONGODB_URI=mongodb://admin:your_secure_password_here@mongodb:27017/agroassist?authSource=admin
JWT_SECRET=your_jwt_secret_here
NODE_ENV=production
```

### 6. Production Security Checklist

- [ ] Changed all default passwords
- [ ] Generated secure JWT secret (64+ characters)
- [ ] Using HTTPS in production
- [ ] Enabled MongoDB authentication
- [ ] Restricted CORS to specific domains
- [ ] Regular security updates
- [ ] Enabled rate limiting
- [ ] Using environment variables (never hardcode secrets)
- [ ] Reviewed `.gitignore` to prevent secret leaks
- [ ] Set up proper firewall rules

### 7. Files to Keep Secret

These files contain sensitive information and must never be committed:

```
.env
AgroAssist/backend/.env
node_modules/
logs/
*.log
*.dump
backup-*/
```

### 8. Security Best Practices

1. **Passwords**: Use strong, unique passwords (20+ characters)
2. **JWT Secrets**: Generate cryptographically secure random strings
3. **API Keys**: Rotate regularly and use different keys per environment
4. **Database**: Always enable authentication in production
5. **HTTPS**: Use SSL/TLS certificates (Let's Encrypt for free)
6. **Updates**: Keep all dependencies updated
7. **Logging**: Don't log sensitive information
8. **Backups**: Regular encrypted backups

### 9. Emergency Response

If you accidentally commit sensitive data:

```bash
# Remove from Git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch AgroAssist/backend/.env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push
git push origin --force --all

# Then immediately:
# 1. Change all exposed credentials
# 2. Rotate JWT secrets
# 3. Update MongoDB password
# 4. Review access logs
```

### 10. Monitoring

Set up monitoring for:
- Failed authentication attempts
- Unusual API access patterns
- Database connection attempts
- File system access
- Resource usage spikes

### 11. Contact

For security issues, please contact:
- Email: security@agroassist.com
- Create a private security advisory on GitHub

---

**Remember: Security is everyone's responsibility!** 🔒
