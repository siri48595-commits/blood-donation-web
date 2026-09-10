# System Architecture

## Overview

Bloodly is a full-stack MERN application with AI integration for intelligent blood donor matching and recipient assistance.

```
┌─────────────────────────────────────────────────────────────────┐
│                      Client (React 18)                          │
│  ├─ Components (UI/Alerts/Navigation)                          │
│  ├─ Pages (Home/Auth/Dashboard/Search/Admin)                   │
│  ├─ Services (API calls/Auth/Donors/Requests/AI)              │
│  ├─ Context (Auth/Theme)                                        │
│  ├─ Hooks (useAuth/useApi/useDebounce)                         │
│  └─ Utils (Constants/Formatters/Blood Groups)                  │
└─────────────────────────────────────────────────────────────────┘
           ↕ HTTP/REST (Axios)
┌─────────────────────────────────────────────────────────────────┐
│                    Server (Express.js)                          │
│  ├─ Routes (Auth/User/Donor/Request/Donation/AI/Admin)        │
│  ├─ Controllers (Request handlers)                              │
│  ├─ Models (Mongoose schemas)                                   │
│  ├─ Middleware (Auth/Role/Error/Rate Limit)                    │
│  ├─ Services (AI/Donor Matching/Email)                         │
│  └─ Utils (Validators/Tokens/Blood/Distance)                   │
└─────────────────────────────────────────────────────────────────┘
           ↕ Database Driver (Mongoose)
┌─────────────────────────────────────────────────────────────────┐
│            Database (MongoDB)                                   │
│  ├─ Users                                                       │
│  ├─ BloodRequests                                              │
│  ├─ DonationRequests                                           │
│  └─ Chats                                                       │
└─────────────────────────────────────────────────────────────────┘
           ↕ API Calls
┌─────────────────────────────────────────────────────────────────┐
│            External Services                                    │
│  └─ Groq AI API (LLaMA 3.1 8B)                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Directory Structure
```
client/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Button.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Alerts.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── RoleRoute.jsx
│   │
│   ├── pages/              # Page components (one per route)
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── DonorSearch.jsx
│   │   ├── CreateRequest.jsx
│   │   ├── Profile.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── NotFound.jsx
│   │
│   ├── context/            # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   └── useDebounce.js
│   │
│   ├── services/           # API communication
│   │   ├── api.js          # Axios instance with interceptors
│   │   ├── authService.js
│   │   ├── donorService.js
│   │   ├── requestService.js
│   │   └── aiService.js
│   │
│   ├── utils/              # Utility functions
│   │   ├── constants.js    # App constants and enums
│   │   ├── bloodGroups.js  # Blood compatibility
│   │   └── formatters.js   # Data formatters
│   │
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Tailwind styles
│
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS config
├── postcss.config.js      # PostCSS config
├── package.json
└── .env.example
```

### Technology Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context + Custom Hooks
- **Icons**: Lucide React

### Key Features
- Responsive design with mobile support
- Dark mode support
- Smooth animations with Framer Motion
- JWT-based authentication
- Protected routes by authentication/role
- Error handling and validation
- Loading states and spinners
- Pagination support
- Real-time search with debouncing

---

## Backend Architecture

### Directory Structure
```
server/
├── config/               # Configuration
│   └── db.js            # MongoDB connection
│
├── controllers/          # Request handlers
│   ├── authController.js
│   ├── userController.js
│   ├── donorController.js
│   ├── requestController.js
│   ├── donationRequestController.js
│   ├── aiController.js
│   └── adminController.js
│
├── models/              # Mongoose schemas
│   ├── User.js
│   ├── BloodRequest.js
│   ├── DonationRequest.js
│   └── Chat.js
│
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── donorRoutes.js
│   ├── requestRoutes.js
│   ├── donationRequestRoutes.js
│   ├── aiRoutes.js
│   └── adminRoutes.js
│
├── middleware/          # Express middleware
│   ├── authMiddleware.js      # JWT verification
│   ├── roleMiddleware.js      # Role-based access
│   ├── errorMiddleware.js     # Error handling
│   └── rateLimiter.js         # Rate limiting
│
├── services/            # Business logic
│   ├── groqService.js   # AI/LLM integration
│   └── donorMatchingService.js  # Donor matching algorithm
│
├── utils/               # Utility functions
│   ├── bloodCompatibility.js
│   ├── generateToken.js
│   ├── validators.js
│   └── distanceService.js
│
├── server.js           # Main server file
├── seed.js             # Database seeding
├── package.json
└── .env.example
```

### Technology Stack
- **Runtime**: Node.js v16+
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **Security**: Helmet, CORS, Rate Limiting
- **External API**: Groq AI API
- **Logging**: Morgan

### Key Features
- RESTful API architecture
- JWT-based authentication
- Role-based access control
- Comprehensive error handling
- Input validation
- Rate limiting
- Database indexing for performance
- Soft delete for data integrity
- AI-powered donor matching

---

## Authentication Flow

```
1. User Registration/Login
   └─ POST /auth/register or /auth/login
   └─ Validate credentials
   └─ Generate JWT token
   └─ Return token + user data
   └─ Client stores token in localStorage

2. Protected Request
   └─ Client adds "Authorization: Bearer <token>" header
   └─ Server authMiddleware verifies JWT
   └─ Extract userId from token
   └─ Proceed to controller

3. Token Expiry
   └─ If token expired: Return 401
   └─ Client removes token and redirects to login
   └─ User must re-authenticate

4. Logout
   └─ POST /auth/logout
   └─ Client removes token from localStorage
   └─ Server-side: Just acknowledgment (stateless)
```

---

## Donor Matching Algorithm

The backend implements a deterministic donor matching system:

```
matchingScore(donor, bloodRequest) = 0-100

1. Blood Compatibility (30 points)
   ├─ Compatible: +30 points
   └─ Incompatible: 0 (No match)

2. Availability Status (25 points)
   ├─ Available: +25 points
   └─ Not Available: +10 points

3. Location Proximity (20 points)
   ├─ Using Haversine formula
   ├─ ≤5 km: +20 points
   ├─ ≤15 km: +15 points
   ├─ ≤30 km: +10 points
   ├─ ≤50 km: +5 points
   └─ Same city (no coords): +15 points

4. Last Donation Date (15 points)
   ├─ 56-365 days ago: +15 points
   ├─ >365 days ago: +12 points
   ├─ 30-56 days ago: +5 points
   └─ New donor: +10 points

5. Account Activity (10 points)
   └─ Active account: +10 points

Total: Cap at 100 points
```

Donors are ranked by matchScore, then returned to recipient.

---

## API Flow

### Example: Create Blood Request and Get Matched Donors

```
Client                          Server                       Database
  │                              │                              │
  ├─ POST /requests ────────────> │                              │
  │  (bloodGroup, city, units)    │─── Validate ──────────────> │
  │                              │                              │
  │                              │<─── Store Request ────────── │
  │                              │                              │
  │                              ├─── Query Compatible Donors ─>│
  │                              │<─── Get Donors ────────────  │
  │                              │                              │
  │                              ├─── Calculate Match Scores    │
  │                              ├─── Sort by Score            │
  │                              ├─── Call Groq API ────────────────┐
  │                              │                              │
  │<───── Return with matches ─── │<─── AI Explanation ─────────┘
  │                              │
  └─ Display Results to User ───>
```

---

## Groq AI Integration

### Donor Matching Explanation
```
Prompt: "A recipient needs O+ blood in Hyderabad.
         Here are potential donors: [donor list]
         Explain ranking, compatibility, and recommendations."

Response: JSON with explanation, recommendations, and disclaimer
```

### AI Chat Assistant
```
Prompt: "How do I find a donor?" (context: user role)

Response: Contextual guidance about donor search, registration, etc.
```

### Rate Limiting
- 10 requests per minute per user
- Prevents API abuse and cost control

---

## Data Flow Examples

### Scenario 1: Donor Search
```
User enters filters (blood group, city)
   ↓
Browser sends GET /donors/search?bloodGroup=O+&city=Hyderabad
   ↓
authMiddleware verifies user token (optional for public search)
   ↓
donorController.searchDonors() executes:
   ├─ Build MongoDB query
   ├─ Filter by blood group, city, availability
   ├─ Apply pagination
   ├─ Return matched donors
   ↓
Client receives donor list
   ↓
User can contact donor or create blood request
```

### Scenario 2: Create Blood Request and Get AI Recommendations
```
User fills blood request form
   ↓
POST /requests with blood request details
   ↓
authMiddleware verifies user is RECIPIENT
   ↓
requestController.createRequest():
   ├─ Validate input
   ├─ Store in MongoDB
   ├─ Call donorMatchingService.findMatchingDonors()
   │   ├─ Query donors with compatible blood group
   │   ├─ Calculate match scores
   │   ├─ Sort by score
   │   └─ Return top 10 donors
   ├─ Asynchronously call groqService.generateExplanation()
   │   ├─ Format donor data
   │   ├─ Call Groq AI API
   │   ├─ Parse AI response
   │   └─ Update request with explanation
   ↓
Return request with matched donors
   ↓
AI explains the ranking on frontend
   ↓
User reviews recommendations and contacts suitable donors
```

---

## Security Architecture

### Authentication
- JWT tokens stored in localStorage (frontend)
- Token verified on each protected request
- 30-day expiration
- Refresh mechanism recommended for production

### Authorization
- Role-based access control (DONOR, RECIPIENT, ADMIN)
- Route-level role checking
- Controller-level permission verification

### Data Protection
- Passwords hashed with bcryptjs (10 salt rounds)
- CORS enabled for allowed origins
- Helmet.js security headers
- Input validation on all endpoints
- Rate limiting on sensitive endpoints

### API Security
- No sensitive data in URLs
- HTTPS recommended for production
- JWT in Authorization header (not cookie)
- Password never returned in responses

---

## Error Handling

### Frontend Error Handling
```javascript
try {
  const response = await apiCall();
  if (!response.success) {
    setError(response.message);
  }
} catch (error) {
  setError(error.response?.data?.message || 'Operation failed');
}
```

### Backend Error Handling
```javascript
- Validation errors: 400 Bad Request
- Authentication errors: 401 Unauthorized
- Permission errors: 403 Forbidden
- Not found: 404 Not Found
- Rate limit: 429 Too Many Requests
- Server errors: 500 Internal Server Error
```

### Error Middleware
- Centralized error handling
- Development vs production error messages
- Error logging (recommended)

---

## Performance Optimization

### Frontend
- Code splitting with lazy loading
- Component memoization where needed
- Debounced search
- Efficient re-renders with Context
- CSS optimization with Tailwind

### Backend
- Database indexing on frequently queried fields
- Query optimization
- Pagination for large datasets
- Connection pooling with MongoDB
- Caching strategies (recommended)

### Network
- Gzip compression (via Helmet)
- Efficient JSON responses
- Minimal data transfer
- API response caching (recommended)

---

## Deployment Architecture

### Frontend (Vercel/Netlify)
```
Git Push → CI/CD → Build → Deploy → CDN
```

### Backend (Render/Railway)
```
Git Push → CI/CD → Build → Deploy → App Server
```

### Database (MongoDB Atlas)
```
Managed MongoDB → Automatic Backups → Replication
```

### Environment Variables
```
Frontend:
  - VITE_API_BASE_URL=https://api.bloodly.com

Backend:
  - MONGO_URI=mongodb+srv://...
  - JWT_SECRET=secure-random-key
  - GROQ_API_KEY=your-key
  - NODE_ENV=production
```

---

## Scalability Considerations

### Horizontal Scaling
- Load balancer for multiple backend instances
- Database replication for read scaling
- CDN for static frontend assets

### Vertical Scaling
- Increase server resources
- Database optimization
- Caching layer (Redis)

### Future Enhancements
- WebSocket for real-time notifications
- Message queue for asynchronous tasks
- Microservices architecture
- GraphQL API
- Mobile app (React Native)

---

## Monitoring & Analytics

### Recommended Tools
- **Monitoring**: New Relic, DataDog
- **Analytics**: Google Analytics, Mixpanel
- **Error Tracking**: Sentry
- **Logging**: CloudWatch, ELK Stack
- **APM**: Datadog, New Relic

### Key Metrics
- API response times
- Error rates
- Database query performance
- User engagement
- Donor/Recipient activity
- Match success rates
