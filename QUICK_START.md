# 🚀 Quick Start Guide - Bloodly

Start the Bloodly blood donation platform in under 5 minutes!

---

## ⚙️ Prerequisites

Before starting, ensure you have:
- **Node.js v16+** ([Download](https://nodejs.org))
- **MongoDB v5+** (Local or [MongoDB Atlas](https://mongodb.com/cloud/atlas))
- **Git**
- **Code editor** (VS Code recommended)
- **Groq API Key** (Free from [console.groq.com](https://console.groq.com))

---

## 📋 Step-by-Step Setup (5 Minutes)

### 1️⃣ Clone & Navigate
```bash
git clone <repository-url>
cd "BLOOD DONATION"
```

### 2️⃣ Backend Setup (2 minutes)
```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env - Add your credentials:
# MONGO_URI=mongodb://localhost:27017/bloodly
# JWT_SECRET=your_secret_key
# GROQ_API_KEY=your_groq_api_key
```

**Can't edit .env?** Use your editor to create `server/.env` with:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/bloodly
JWT_SECRET=your-super-secret-key-change-this
GROQ_API_KEY=your-groq-api-key-here
CORS_ORIGIN=http://localhost:5173
```

### 3️⃣ Frontend Setup (2 minutes)
```bash
cd ../client

# Install dependencies
npm install

# Create environment file
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env.local
```

### 4️⃣ Start Development Servers
**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs at: http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Frontend runs at: http://localhost:5173
```

### 5️⃣ Add Demo Data (Optional)
```bash
cd server
npm run seed
```

---

## 🔐 Demo Credentials

After running seed script, use these to login:

| Role | Email | Password |
|------|-------|----------|
| Donor | raj@example.com | password123 |
| Recipient | rohit@example.com | password123 |
| Admin | admin@bloodly.com | password123 |

---

## ✅ Verify Everything Works

1. **Frontend loads**: Visit http://localhost:5173 ✓
2. **Backend runs**: Visit http://localhost:5000 ✓
3. **Can login**: Use demo credentials ✓
4. **Can search donors**: Navigate to "Search Donors" ✓
5. **Dark mode works**: Click theme toggle in navbar ✓

---

## 🗺️ Key Routes

**Frontend:**
- Home: http://localhost:5173
- Register: http://localhost:5173/register
- Dashboard: http://localhost:5173/dashboard
- Donor Search: http://localhost:5173/donor-search
- Admin: http://localhost:5173/admin

**Backend:**
- Base URL: http://localhost:5000/api
- API Docs: See [api-documentation.md](docs/api-documentation.md)

---

## 🆘 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB locally or use MongoDB Atlas connection string

### Port Already in Use
```bash
# Find and kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# For port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Ensure `CORS_ORIGIN=http://localhost:5173` in server/.env

### Token Expired Error
```
Error: jwt malformed or jwt expired
```
**Solution**: This is normal - just login again

### Module Not Found Error
```
Cannot find module 'express'
```
**Solution**: Run `npm install` in the project directory

---

## 📚 Documentation

- **Full Setup Guide**: [deployment-setup.md](docs/deployment-setup.md)
- **API Reference**: [api-documentation.md](docs/api-documentation.md)
- **Database Design**: [database-schema.md](docs/database-schema.md)
- **System Architecture**: [system-architecture.md](docs/system-architecture.md)
- **README**: [README.md](README.md)

---

## 🧪 Testing the System

### Test 1: Authentication
1. Go to http://localhost:5173/register
2. Create a new account
3. Login with your credentials
4. Verify dashboard loads ✓

### Test 2: Donor Search
1. Go to "Donor Search"
2. Filter by blood group and city
3. See matching donors (if seed data was added)
4. Verify results load ✓

### Test 3: Create Blood Request
1. Go to "Dashboard"
2. Create a new blood request
3. See matched donors
4. Verify AI recommendations appear ✓

### Test 4: Dark Mode
1. Click theme toggle (moon icon) in navbar
2. Verify all pages change to dark mode
3. Refresh page - dark mode persists ✓

---

## 🚀 Next Steps

1. **Review Architecture**: Read [system-architecture.md](docs/system-architecture.md)
2. **Explore API**: Check [api-documentation.md](docs/api-documentation.md)
3. **Understand Database**: See [database-schema.md](docs/database-schema.md)
4. **Deploy to Production**: Follow [deployment-setup.md](docs/deployment-setup.md)

---

## 🛠️ Common Commands

```bash
# Backend commands (in server/ directory)
npm run dev                 # Start with auto-reload
npm start                   # Start production server
npm run seed                # Load demo data
npm test                    # Run tests
npm run build               # Build for production

# Frontend commands (in client/ directory)
npm run dev                 # Start dev server
npm run build               # Build for production
npm run preview             # Preview production build
npm run test                # Run tests
npm run lint                # Check code quality

# Install new packages
npm install package-name    # Add dependency
npm install --save-dev pkg  # Add dev dependency
npm uninstall package-name  # Remove dependency
```

---

## 📞 Getting Help

- **Issues**: Check [GitHub Issues](https://github.com/bloodly/bloodly/issues)
- **Documentation**: Read the [docs/](docs/) folder
- **Chat**: Join [Discord community](https://discord.gg/bloodly)
- **Email**: support@bloodly.com

---

## 💡 Tips

- **Use Postman/Thunder Client** to test API endpoints
- **Check browser console** for frontend errors
- **Check terminal** for backend errors
- **Read error messages** - they're usually helpful!
- **Google the error** - community has usually solved it
- **Ask in Discord** - community is helpful

---

## ✨ Success! 🎉

You now have a fully functional blood donation platform running locally!

**What to do next:**
1. Explore the codebase
2. Test different user flows
3. Read the documentation
4. Deploy to production when ready
5. Customize for your use case

---

<div align="center">

**Made with ❤️ to save lives**

[Back to README](README.md) • [Documentation](docs/) • [GitHub](https://github.com/bloodly/bloodly)

</div>
