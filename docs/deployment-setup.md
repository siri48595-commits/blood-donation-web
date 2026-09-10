# Deployment & Setup Guide

## Local Development Setup

### Prerequisites
- Node.js v16+ ([Download](https://nodejs.org))
- MongoDB v5+ (Local or MongoDB Atlas)
- Git
- Code editor (VS Code recommended)

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd "BLOOD DONATION"
```

### Step 2: Backend Setup

#### 2.1 Navigate to Server Directory
```bash
cd server
```

#### 2.2 Install Dependencies
```bash
npm install
```

#### 2.3 Create Environment File
Create `.env` file:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/bloodly
# OR MongoDB Atlas
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bloodly

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Groq AI API
GROQ_API_KEY=your_groq_api_key_from_groq_console

# CORS
CORS_ORIGIN=http://localhost:5173

# Email (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### 2.4 Start MongoDB (If Local)
```bash
# Windows (with MongoDB installed)
mongod

# Or use MongoDB Compass for GUI
```

#### 2.5 Run Backend Server
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

Server starts at: `http://localhost:5000`

### Step 3: Frontend Setup

#### 3.1 Navigate to Client Directory
```bash
cd ../client
```

#### 3.2 Install Dependencies
```bash
npm install
```

#### 3.3 Create Environment File
Create `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

#### 3.4 Start Development Server
```bash
npm run dev
```

Frontend starts at: `http://localhost:5173`

### Step 4: Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **API Documentation**: http://localhost:5000/api-docs

### Step 5: Seed Demo Data
```bash
cd server
npm run seed
```

Demo Credentials:
```
Donor:
  Email: raj@example.com
  Password: password123

Recipient:
  Email: rohit@example.com
  Password: password123

Admin:
  Email: admin@bloodly.com
  Password: password123
```

---

## Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development/production |
| `MONGO_URI` | MongoDB connection | mongodb://localhost:27017/bloodly |
| `JWT_SECRET` | JWT signing key | secure-random-key |
| `GROQ_API_KEY` | Groq AI API key | (from Groq Console) |
| `CORS_ORIGIN` | Frontend URL | http://localhost:5173 |
| `RATE_LIMIT_*` | Rate limiting config | (see above) |

### Frontend (.env.local)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | http://localhost:5000/api |

---

## Production Deployment

### Option 1: Deploy to Vercel (Frontend)

#### 1. Push Code to GitHub
```bash
git remote add origin <github-repo-url>
git push -u origin main
```

#### 2. Connect to Vercel
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Select GitHub repository
- Set root directory: `client`
- Add environment variables:
  ```
  VITE_API_BASE_URL=https://api.bloodly.com
  ```

#### 3. Deploy
- Click "Deploy"
- Vercel auto-deploys on every push to main

### Option 2: Deploy to Netlify (Frontend)

#### 1. Build Locally
```bash
cd client
npm run build
```

#### 2. Deploy with Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Or connect GitHub repository on [netlify.com](https://netlify.com)

---

### Option 3: Deploy to Render (Backend)

#### 1. Prepare Repository
Ensure `server/` directory has:
- `package.json`
- `.env` variables set in Render dashboard
- `npm start` command in scripts

#### 2. Connect to Render
- Go to [render.com](https://render.com)
- Click "New +" → "Web Service"
- Connect GitHub repository
- Configure:
  - **Name**: bloodly-api
  - **Root Directory**: server
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
  - **Environment**: Node
  - **Plan**: Free (or Starter)

#### 3. Add Environment Variables
In Render dashboard, add all `.env` variables:
- `MONGO_URI`
- `JWT_SECRET`
- `GROQ_API_KEY`
- etc.

#### 4. Deploy
- Click "Create Web Service"
- Render auto-deploys on GitHub push

---

### Option 4: Deploy to Railway (Backend)

#### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

#### 2. Login and Deploy
```bash
railway login
cd server
railway init
railway up
```

#### 3. Add Environment Variables
```bash
railway variables set MONGO_URI=mongodb+srv://...
railway variables set JWT_SECRET=secure-key
# ... add all other variables
```

#### 4. View Deployment
```bash
railway open
```

---

### MongoDB Atlas Setup (Cloud Database)

#### 1. Create Cluster
- Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- Sign up/Login
- Create new project
- Create cluster (choose M0 Free tier)

#### 2. Configure Database Access
- Add database user (username/password)
- Allow network access (0.0.0.0/0 for development)

#### 3. Get Connection String
- Click "Connect"
- Choose "Connect your application"
- Copy connection string
- Replace `<username>`, `<password>`, `<dbname>` with your values

#### 4. Update `.env`
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bloodly?retryWrites=true&w=majority
```

---

### Groq AI API Setup

#### 1. Get API Key
- Go to [console.groq.com](https://console.groq.com)
- Sign up/Login
- Navigate to API keys
- Create new API key
- Copy the key

#### 2. Add to Environment
```env
GROQ_API_KEY=your_api_key_here
```

#### 3. Test Integration
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"message":"How do I find a donor?"}'
```

---

## SSL/HTTPS Configuration

### Using Let's Encrypt (for self-hosted)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Configure in Express
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/fullchain.pem')
};

https.createServer(options, app).listen(443);
```

### Using Managed SSL (Recommended)
- Render: Auto HTTPS
- Railway: Auto HTTPS
- Vercel: Auto HTTPS
- Netlify: Auto HTTPS

---

## Docker Deployment

### Create Dockerfile (Backend)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Build and Run
```bash
docker build -t bloodly-api .
docker run -p 5000:5000 --env-file .env bloodly-api
```

### Docker Compose (Backend + Database)
```yaml
version: '3.8'
services:
  api:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/bloodly
      - JWT_SECRET=${JWT_SECRET}
      - GROQ_API_KEY=${GROQ_API_KEY}
    depends_on:
      - mongodb

  mongodb:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

Run with:
```bash
docker-compose up
```

---

## CI/CD Pipeline

### GitHub Actions (Automatic Testing & Deployment)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install Dependencies
        run: npm install
        working-directory: ./server
      
      - name: Run Tests
        run: npm test
        working-directory: ./server

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

## Monitoring & Logging

### Server Logs (Render/Railway)
- Automatic log streaming in dashboard
- Download logs for analysis

### Frontend Analytics
```javascript
// Add to src/App.jsx
import { useEffect } from 'react';

useEffect(() => {
  // Google Analytics
  window.gtag('config', 'GA_MEASUREMENT_ID', {
    page_path: window.location.pathname
  });
}, []);
```

### Error Tracking (Sentry)
```bash
npm install @sentry/react

# In src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});
```

---

## Backup & Recovery

### MongoDB Atlas Backups
- Automatic daily backups (M0 free tier)
- Configurable retention (default: 7 days)
- Point-in-time restore available

### Manual Backup
```bash
# Export data
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/bloodly" --out ./backup

# Import data
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/bloodly" ./backup
```

### GitHub Backups
```bash
# Already using Git for code backup
git push # Push regularly
```

---

## Performance Optimization

### Frontend Build Optimization
```bash
cd client
npm run build
# Check bundle size
npm install -g vite-plugin-visualizer
```

### Backend Performance
```bash
# Enable compression
npm install compression

# Database indexing (already done in schema)
# Add caching layer (Redis)
npm install redis
```

### CDN for Static Assets
- Vercel: Built-in CDN
- Netlify: Built-in CDN
- Or add Cloudflare in front of backend

---

## Testing

### Backend Testing
```bash
npm install --save-dev jest supertest

# Run tests
npm test
```

### Frontend Testing
```bash
npm install --save-dev @testing-library/react vitest

# Run tests
npm run test
```

---

## Troubleshooting

### MongoDB Connection Issues
```
Error: connect ECONNREFUSED
Solution: Ensure MongoDB is running and MONGO_URI is correct
```

### CORS Errors
```
Error: Access to XMLHttpRequest blocked by CORS policy
Solution: Check CORS_ORIGIN in .env matches frontend URL
```

### JWT Token Expired
```
Error: jwt malformed or expired
Solution: User must re-login to get new token
```

### Groq API Errors
```
Error: 429 Too Many Requests
Solution: Check rate limiting (10 requests/minute)
```

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

---

## Production Checklist

- [ ] Environment variables securely configured
- [ ] HTTPS/SSL enabled
- [ ] Database backups configured
- [ ] Error monitoring (Sentry) set up
- [ ] Performance monitoring enabled
- [ ] Rate limiting configured
- [ ] CORS origins restricted (not 0.0.0.0)
- [ ] Password hashing verified (bcryptjs)
- [ ] JWT secret is strong and unique
- [ ] API documentation updated
- [ ] Frontend build optimized
- [ ] Database indexes created
- [ ] Logging enabled
- [ ] CI/CD pipeline configured
- [ ] User data privacy policies set
- [ ] Health check endpoint added

---

## Health Check Endpoint

Add to backend for monitoring:
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});
```

Check status:
```bash
curl https://api.bloodly.com/health
```

---

## Support & Contact

For issues and questions:
- GitHub Issues: https://github.com/bloodly/bloodly
- Email: support@bloodly.com
- Discord: https://discord.gg/bloodly

---

## License

Bloodly is licensed under the MIT License. See LICENSE file for details.
