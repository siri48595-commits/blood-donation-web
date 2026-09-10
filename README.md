# Bloodly
## AI-Enabled Smart Blood Donation Management System

### Project Abstract
Bloodly is a comprehensive web-based platform that connects blood donors and recipients using the MERN stack (MongoDB, Express.js, React.js, Node.js). The system leverages AI-powered donor matching through Groq's Llama 3.1 8B model to intelligently identify suitable donors based on blood group compatibility, location proximity, availability status, and other critical factors.

The platform addresses the critical challenge of timely blood availability during medical emergencies by providing:
- Real-time donor discovery
- AI-assisted donor identification
- Location-based matching
- Secure user authentication
- Emergency request prioritization
- Complete donation management workflow

### 🎯 Key Features

#### For Donors
- ✅ Secure registration and authentication
- ✅ Profile management with blood group and location
- ✅ Availability status updates
- ✅ Donation history tracking
- ✅ Receive and respond to blood requests
- ✅ Interact with Bloodly AI Assistant

#### For Recipients
- ✅ Search donors by blood group, location, and availability
- ✅ AI-powered donor ranking and suggestions
- ✅ Create urgent/emergency blood requests
- ✅ Real-time donor matching
- ✅ Request history and status tracking
- ✅ Direct donor contact and messaging
- ✅ Chat with AI assistant for guidance

#### For Admins
- ✅ Comprehensive user management
- ✅ Donor and recipient oversight
- ✅ Blood request monitoring
- ✅ System statistics and analytics
- ✅ Account activation/deactivation
- ✅ Platform activity tracking

### 🤖 AI Features

#### 1. AI Donor Identification Assistant
The system uses Groq's Llama 3.1 8B model to:
- Rank potential donors based on predefined criteria
- Explain blood group compatibility
- Assist with emergency request prioritization
- Provide system navigation guidance
- Summarize donor and request information

**Important**: The AI assists with discovery only. Medical eligibility decisions remain with healthcare professionals.

#### 2. Bloodly AI Chat Assistant
A dedicated AI assistant available throughout the platform to answer questions about:
- Finding donors
- Registration process
- Profile management
- Blood group information
- Emergency request creation
- Donor matching explanation

### 🚀 Technology Stack

| Component | Technologies |
|-----------|--------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Axios, React Router |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs |
| **AI** | Groq API (llama-3.1-8b-instant) |
| **Database** | MongoDB (NoSQL) |
| **Authentication** | JWT + bcryptjs |
| **APIs** | RESTful Architecture |

### 📋 System Requirements

- Node.js v16+
- npm v8+
- MongoDB v5+ (Atlas recommended)
- Groq API Key

### 📦 Installation

#### 1. Clone Repository
```bash
git clone <repository-url>
cd AI-Blood-Donation-System
```

#### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Add your MongoDB URI and Groq API Key to .env
```

#### 3. Frontend Setup
```bash
cd ../client
npm install
cp .env.example .env
# Configure API base URL in .env
```

### 🏃 Running the Application

#### Terminal 1 - Start Backend
```bash
cd server
npm run dev
```
Backend runs on: `http://localhost:5000`

#### Terminal 2 - Start Frontend
```bash
cd client
npm run dev
```
Frontend runs on: `http://localhost:5173`

### 🔐 Environment Configuration

#### Server `.server/.env`
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bloodly
JWT_SECRET=your-secure-jwt-secret-key-here
GROQ_API_KEY=your-groq-api-key-here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=Bloodly <no-reply@example.com>
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
WHATSAPP_COUNTRY_CODE=+91
```

#### Client `client/.env`
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### 🏗️ Project Structure

```
AI-Blood-Donation-System/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                          # Express backend
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── docs/                            # Documentation
│   ├── api-documentation.md
│   ├── database-schema.md
│   ├── system-architecture.md
│   └── deployment.md
│
├── README.md                        # This file
├── .gitignore
└── docs/
```

### 📡 API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request a password reset email
- `POST /api/auth/reset-password` - Set a new password with a reset token
- `POST /api/auth/forgot-password/phone` - Request a WhatsApp password reset OTP
- `POST /api/auth/reset-password/otp` - Verify the OTP and set a new password

#### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/availability` - Update donor availability

#### Donor Search
- `GET /api/donors` - List all donors
- `GET /api/donors/:id` - Get donor details
- `GET /api/donors/search` - Search donors with filters

#### Blood Requests
- `POST /api/requests` - Create blood request
- `GET /api/requests` - Get all requests
- `PUT /api/requests/:id` - Update request status
- `DELETE /api/requests/:id` - Cancel request

#### Donation Requests
- `POST /api/donation-requests` - Send donation request
- `GET /api/donation-requests` - Get all requests
- `PUT /api/donation-requests/:id` - Respond to request

#### AI Features
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/match-donors` - AI-assisted donor matching
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/history/:conversationId` - Clear conversation

#### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Manage users
- `PUT /api/admin/users/:id` - Update user status
- `DELETE /api/admin/users/:id` - Delete user

### 🩸 Blood Group Compatibility

| Donor Type | Can Donate To | Can Receive From |
|------------|---------------|------------------|
| O+ | A+, B+, AB+, O+ | O+, O- |
| O- | All (Universal Donor) | O- |
| A+ | A+, AB+ | A+, A-, O+, O- |
| A- | A+, A-, AB+, AB- | A-, O- |
| B+ | B+, AB+ | B+, B-, O+, O- |
| B- | B+, B-, AB+, AB- | B-, O- |
| AB+ | AB+ | All (Universal Recipient) |
| AB- | AB+, AB- | A-, B-, AB-, O- |

### 🗺️ Location-Based Features

The system supports:
- City and state-level filtering
- Area and pincode-based search
- Latitude/longitude coordinates (optional)
- Haversine distance calculation for proximity matching
- Radius-based donor search

### 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Helmet**: HTTP security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Express rate limiter for API protection
- **Input Validation**: Comprehensive server-side validation
- **Environment Variables**: Sensitive data in .env files
- **Role-Based Access Control**: Fine-grained authorization
- **No API Key Exposure**: Groq key secured server-side only

### ⚠️ Medical Safety Disclaimer

**Important**: Bloodly is a platform for donor discovery and coordination. 

**The AI system:**
- ✅ Assists with donor identification
- ✅ Ranks potential donors based on system criteria
- ✅ Provides educational information
- ✅ Helps navigate the platform

**The AI system does NOT:**
- ❌ Make medical eligibility decisions
- ❌ Guarantee donor suitability
- ❌ Replace medical professionals
- ❌ Provide medical advice

**Final verification** of donor eligibility, blood compatibility, and medical suitability MUST be conducted by qualified healthcare professionals or authorized blood banks.

### 🧪 Testing

#### Backend Testing
```bash
cd server
npm test
```

#### Frontend Testing
```bash
cd client
npm test
```

### ☁️ Deployment

#### Frontend Deployment (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy 'dist' folder
```

#### Backend Deployment (Render/Railway)
```bash
cd server
npm start
# Set environment variables in platform settings
```

#### Database
Use MongoDB Atlas with:
- Network access enabled for your deployment IP
- Backup enabled
- Monitoring configured

### 📈 Performance Considerations

- Lazy-loaded React routes
- Database query optimization with indexes
- Pagination for large datasets
- Debounced search operations
- Efficient component re-rendering
- Asset optimization and caching

### 🚀 Future Enhancements

- SMS/Email notifications for donor requests
- Push notifications via browser/mobile
- Hospital/blood bank integration
- Advanced analytics dashboard
- Multilingual support
- Real-time WebSocket notifications
- Mobile application (React Native)
- Machine learning for better donor matching
- Video verification for donors
- Appointment scheduling system
- Donation center locator
- Blood inventory tracking

### 📞 Support & Contact

For issues, questions, or deployment help, refer to:
- API Documentation: `docs/api-documentation.md`
- Database Schema: `docs/database-schema.md`
- Architecture: `docs/system-architecture.md`
- Deployment: `docs/deployment.md`

### 📄 License

This academic project is provided for educational purposes.

### 👥 Contributors

Developed as an academic MERN stack project demonstrating full-stack development with AI integration.

---

**Bloodly** - Making blood donation simple, secure, and accessible.
#   b l o o d - d o n a t i o n 
 
 #   b l o o d - d o n a t i o n 
 
 #   b l o o d - d o n a t i o n 
 
 #   b l o o d - d o n a t i o n - w e b  
 