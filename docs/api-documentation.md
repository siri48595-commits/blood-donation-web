# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format
### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Authentication Endpoints

### Register
- **Method**: POST
- **Endpoint**: `/auth/register`
- **Auth**: None
- **Rate Limit**: 5 requests per 15 minutes
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "phone": "9876543210",
  "role": "DONOR",
  "bloodGroup": "O+",
  "dateOfBirth": "1995-05-15",
  "gender": "MALE",
  "city": "Hyderabad",
  "state": "Telangana",
  "area": "Banjara Hills",
  "pincode": "500034"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "DONOR",
    "bloodGroup": "O+"
  }
}
```

### Login
- **Method**: POST
- **Endpoint**: `/auth/login`
- **Auth**: None
- **Rate Limit**: 5 requests per 15 minutes
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response**: Same as register

### Logout
- **Method**: POST
- **Endpoint**: `/auth/logout`
- **Auth**: Required

---

## User Endpoints

### Get Profile
- **Method**: GET
- **Endpoint**: `/user/profile`
- **Auth**: Required
- **Response**:
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "DONOR",
    "bloodGroup": "O+",
    "city": "Hyderabad",
    "state": "Telangana",
    "isAvailable": true,
    "lastDonationDate": "2024-08-01"
  }
}
```

### Update Profile
- **Method**: PUT
- **Endpoint**: `/user/profile`
- **Auth**: Required
- **Request Body**:
```json
{
  "name": "John Doe Updated",
  "phone": "9876543210",
  "city": "Hyderabad",
  "state": "Telangana",
  "area": "Jubilee Hills",
  "pincode": "500033"
}
```

### Update Availability
- **Method**: PUT
- **Endpoint**: `/user/availability`
- **Auth**: Required
- **Request Body**:
```json
{
  "isAvailable": true
}
```

### Update Last Donation Date
- **Method**: PUT
- **Endpoint**: `/user/last-donation`
- **Auth**: Required
- **Response**: Updates lastDonationDate to current date

---

## Donor Endpoints

### Get All Donors
- **Method**: GET
- **Endpoint**: `/donors?page=1&limit=10`
- **Auth**: None
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 10)

### Get Donor by ID
- **Method**: GET
- **Endpoint**: `/donors/:id`
- **Auth**: Required

### Search Donors
- **Method**: GET
- **Endpoint**: `/donors/search?bloodGroup=O+&city=Hyderabad&available=true`
- **Auth**: None
- **Query Parameters**:
  - `bloodGroup` (optional)
  - `city` (optional)
  - `state` (optional)
  - `area` (optional)
  - `pincode` (optional)
  - `available` (optional: true/false)
  - `radius` (optional: kilometers)
  - `latitude` (optional: for radius search)
  - `longitude` (optional: for radius search)
  - `page` (default: 1)
  - `limit` (default: 10)

### Get Donor Statistics
- **Method**: GET
- **Endpoint**: `/donors/stats`
- **Auth**: None
- **Response**:
```json
{
  "success": true,
  "data": {
    "totalDonors": 100,
    "availableDonors": 45,
    "byBloodGroup": [
      { "_id": "O+", "count": 30 },
      { "_id": "A+", "count": 25 }
    ]
  }
}
```

---

## Blood Request Endpoints

### Create Request
- **Method**: POST
- **Endpoint**: `/requests`
- **Auth**: Required (RECIPIENT role)
- **Request Body**:
```json
{
  "patientName": "Patient Name",
  "bloodGroup": "O+",
  "unitsRequired": 2,
  "hospitalName": "Apollo Hospitals",
  "hospitalLocation": "Hyderabad",
  "city": "Hyderabad",
  "state": "Telangana",
  "pincode": "500082",
  "latitude": 17.3850,
  "longitude": 78.4867,
  "urgency": "URGENT",
  "description": "Emergency surgery required"
}
```

### Get All Requests
- **Method**: GET
- **Endpoint**: `/requests?page=1&limit=10&status=PENDING`
- **Auth**: None
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `status` (optional: PENDING, MATCHED, FULFILLED, CANCELLED)

### Get My Requests
- **Method**: GET
- **Endpoint**: `/requests/user/my-requests?page=1&limit=10`
- **Auth**: Required
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 10)

### Get Request by ID
- **Method**: GET
- **Endpoint**: `/requests/:id`
- **Auth**: Required

### Update Request
- **Method**: PUT
- **Endpoint**: `/requests/:id`
- **Auth**: Required (Requester or Admin)
- **Request Body**:
```json
{
  "status": "FULFILLED",
  "urgency": "URGENT",
  "description": "Updated description"
}
```

### Delete Request
- **Method**: DELETE
- **Endpoint**: `/requests/:id`
- **Auth**: Required (Requester or Admin)

---

## Donation Request Endpoints

### Send Donation Request
- **Method**: POST
- **Endpoint**: `/donation-requests`
- **Auth**: Required
- **Request Body**:
```json
{
  "donorId": "507f1f77bcf86cd799439011",
  "bloodRequestId": "507f1f77bcf86cd799439012",
  "message": "I can donate"
}
```

### Get All Donation Requests
- **Method**: GET
- **Endpoint**: `/donation-requests?page=1&limit=10`
- **Auth**: Required
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `status` (optional: PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED)

### Update Donation Request
- **Method**: PUT
- **Endpoint**: `/donation-requests/:id`
- **Auth**: Required (Donor, Recipient, or Admin)
- **Request Body**:
```json
{
  "status": "ACCEPTED",
  "donorMessage": "I will donate tomorrow"
}
```

---

## AI Endpoints

### Chat with AI
- **Method**: POST
- **Endpoint**: `/ai/chat`
- **Auth**: Required
- **Rate Limit**: 10 requests per minute
- **Request Body**:
```json
{
  "message": "How can I find a blood donor?",
  "conversationId": "optional-id"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "userMessage": "How can I find a blood donor?",
    "aiResponse": "You can search for donors using...",
    "conversationId": "generated-id"
  }
}
```

### Match Donors with AI
- **Method**: POST
- **Endpoint**: `/ai/match-donors`
- **Auth**: Required
- **Rate Limit**: 10 requests per minute
- **Request Body**:
```json
{
  "bloodRequestId": "507f1f77bcf86cd799439011"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "donors": [
      {
        "id": "507f1f77bcf86cd799439012",
        "name": "Raj Kumar",
        "bloodGroup": "O+",
        "city": "Hyderabad",
        "matchScore": 85,
        "distance": 5.2
      }
    ],
    "statistics": {
      "totalMatches": 3,
      "availableCount": 2,
      "averageScore": 78
    },
    "aiExplanation": {
      "message": "Found suitable donors...",
      "recommendations": ["Raj Kumar", "Priya Sharma"],
      "disclaimer": "Verify with healthcare professionals"
    }
  }
}
```

---

## Admin Endpoints

All admin endpoints require authentication and ADMIN role.

### Get Dashboard
- **Method**: GET
- **Endpoint**: `/admin/dashboard`
- **Response**:
```json
{
  "success": true,
  "data": {
    "users": {
      "totalUsers": 150,
      "totalDonors": 80,
      "totalRecipients": 70,
      "availableDonors": 45
    },
    "requests": {
      "totalRequests": 50,
      "pendingRequests": 10,
      "fulfilledRequests": 35,
      "urgentRequests": 5
    },
    "donations": {
      "totalDonationRequests": 30,
      "acceptedDonations": 20,
      "completedDonations": 15
    },
    "bloodGroupStats": [
      { "_id": "O+", "count": 35 },
      { "_id": "A+", "count": 30 }
    ]
  }
}
```

### Get All Users
- **Method**: GET
- **Endpoint**: `/admin/users?page=1&limit=10&role=DONOR`
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `role` (optional: DONOR, RECIPIENT, ADMIN)

### Update User
- **Method**: PUT
- **Endpoint**: `/admin/users/:id`
- **Request Body**:
```json
{
  "isActive": false,
  "role": "ADMIN"
}
```

### Delete User
- **Method**: DELETE
- **Endpoint**: `/admin/users/:id`
- **Note**: Soft delete - marks user as inactive

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

---

## Blood Group Compatibility

### O+ (Universal Donor Positive)
- Can donate to: A+, B+, AB+, O+
- Can receive from: O+, O-

### O- (Universal Donor Negative)
- Can donate to: All groups
- Can receive from: O-

### A+
- Can donate to: A+, AB+
- Can receive from: A+, A-, O+, O-

### A-
- Can donate to: A+, A-, AB+, AB-
- Can receive from: A-, O-

### B+
- Can donate to: B+, AB+
- Can receive from: B+, B-, O+, O-

### B-
- Can donate to: B+, B-, AB+, AB-
- Can receive from: B-, O-

### AB+ (Universal Recipient Positive)
- Can donate to: AB+
- Can receive from: All groups

### AB- (Universal Recipient Negative)
- Can donate to: AB+, AB-
- Can receive from: A-, B-, AB-, O-

---

## Rate Limiting

- **Default**: 100 requests per 15 minutes
- **Auth endpoints**: 5 requests per 15 minutes
- **AI endpoints**: 10 requests per minute

Headers returned with rate limit info:
- `RateLimit-Limit`
- `RateLimit-Remaining`
- `RateLimit-Reset`

---

## Pagination

All list endpoints support pagination:
- **Query Parameters**:
  - `page` (default: 1, starting from 1)
  - `limit` (default: 10, max: 100)

- **Response**:
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

---

## Testing

Use Postman or any HTTP client to test these endpoints.

For demo credentials:
- **Donor**: raj@example.com / password123
- **Recipient**: rohit@example.com / password123
- **Admin**: admin@bloodly.com / password123

After login, use the returned token in the Authorization header for protected endpoints.
