# Database Schema

## MongoDB Collections

### 1. Users Collection

Stores user accounts for donors, recipients, and admins.

```javascript
{
  _id: ObjectId,
  name: String (required, min: 2),
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcryptjs),
  phone: String (required),
  role: String (enum: ['DONOR', 'RECIPIENT', 'ADMIN'], default: 'RECIPIENT'),
  bloodGroup: String (enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], required),
  dateOfBirth: Date (required),
  gender: String (enum: ['MALE', 'FEMALE', 'OTHER'], required),
  city: String (required),
  state: String (required),
  area: String (required),
  pincode: String (required, format: 5-6 digits),
  latitude: Number (optional, -90 to 90),
  longitude: Number (optional, -180 to 180),
  isAvailable: Boolean (default: false, for donors),
  lastDonationDate: Date (optional),
  profileImage: String (optional, URL),
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- `email` (unique)
- `bloodGroup`
- `city, state`
- `role`
- `isAvailable`

---

### 2. BloodRequests Collection

Stores blood donation requests from recipients.

```javascript
{
  _id: ObjectId,
  requesterId: ObjectId (ref: 'User', required),
  patientName: String (required),
  bloodGroup: String (enum, required),
  unitsRequired: Number (required, 1-20),
  hospitalName: String (required),
  hospitalLocation: String (required),
  city: String (required),
  state: String (required),
  pincode: String (required),
  latitude: Number (optional),
  longitude: Number (optional),
  urgency: String (enum: ['NORMAL', 'URGENT', 'CRITICAL'], default: 'NORMAL'),
  description: String (max: 500),
  status: String (
    enum: ['PENDING', 'MATCHED', 'FULFILLED', 'CANCELLED'],
    default: 'PENDING'
  ),
  matchedDonors: [
    {
      donorId: ObjectId (ref: 'User'),
      matchScore: Number (0-100),
      timestamp: Date
    }
  ],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- `requesterId`
- `bloodGroup`
- `status`
- `urgency`
- `city, state`
- `createdAt` (descending)

---

### 3. DonationRequests Collection

Tracks donation requests sent by donors to recipients.

```javascript
{
  _id: ObjectId,
  requestId: ObjectId (ref: 'BloodRequest', required),
  donorId: ObjectId (ref: 'User', required),
  recipientId: ObjectId (ref: 'User', required),
  bloodRequestId: ObjectId (ref: 'BloodRequest', required),
  status: String (
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  ),
  message: String (max: 300),
  donorMessage: String (max: 300),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**:
- `donorId`
- `recipientId`
- `requestId`
- `status`
- `createdAt` (descending)

---

### 4. Chats Collection

Stores AI conversation messages.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  conversationId: String (required),
  message: String (required),
  role: String (enum: ['user', 'assistant', 'system'], required),
  timestamp: Date (auto)
}
```

**Indexes**:
- `userId, conversationId`
- `conversationId`
- `timestamp` (descending)

---

## Data Types

### String
Text data, stored as UTF-8.

### Number
Numeric values (integers and floats).

### Date
ISO 8601 format date and time.

### ObjectId
MongoDB unique identifier for references.

### Boolean
True or false values.

### Array
Collections of values or documents.

---

## Relationships

### User → BloodRequest
- One user can create multiple blood requests
- Relationship: One-to-Many
- Foreign Key: `BloodRequest.requesterId`

### User → DonationRequest
- Donors receive multiple donation requests
- Recipients receive multiple donation requests
- Relationship: One-to-Many
- Foreign Key: `DonationRequest.donorId`, `DonationRequest.recipientId`

### BloodRequest → DonationRequest
- One blood request can have multiple donation responses
- Relationship: One-to-Many
- Foreign Key: `DonationRequest.bloodRequestId`

### User → Chat
- One user can have multiple chat conversations
- Relationship: One-to-Many
- Foreign Key: `Chat.userId`

---

## Blood Group Storage

Blood groups are stored as strings to support compatibility queries:
- Positive: 'A+', 'B+', 'AB+', 'O+'
- Negative: 'A-', 'B-', 'AB-', 'O-'

---

## Geographic Data

- **city**: String name of city (e.g., "Hyderabad")
- **state**: String name of state (e.g., "Telangana")
- **pincode**: 5-6 digit string (validated with regex)
- **latitude/longitude**: Numbers for precise location (optional, used for radius search)

---

## Status Enums

### Blood Request Status
- `PENDING`: Request created, awaiting donor matches
- `MATCHED`: Donors found and matched
- `FULFILLED`: Blood received
- `CANCELLED`: Request cancelled

### Donation Request Status
- `PENDING`: Awaiting donor response
- `ACCEPTED`: Donor accepted request
- `REJECTED`: Donor rejected request
- `COMPLETED`: Donation completed
- `CANCELLED`: Request cancelled

### User Role
- `DONOR`: Can donate blood
- `RECIPIENT`: Can request blood
- `ADMIN`: System administrator

### Urgency Level
- `NORMAL`: Routine donation
- `URGENT`: Needed within 24 hours
- `CRITICAL`: Needed immediately

---

## Data Validation

### Email
- Must be unique
- Format: `user@domain.com`
- Regex: `/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/`

### Password
- Minimum 6 characters
- Hashed with bcryptjs (salt rounds: 10)

### Phone
- Must be 10 digits (after removing special characters)

### Pincode
- 5-6 digits
- Regex: `/^\d{5,6}$/`

### Coordinates
- Latitude: -90 to 90
- Longitude: -180 to 180

### Blood Group
- Must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-

---

## Indexing Strategy

All collections have strategic indexes for performance:

### User Indexes (for faster queries)
- Email lookup
- Role-based filtering
- Blood group filtering
- Geographic queries
- Availability status

### BloodRequest Indexes
- Quick retrieval by requester
- Filtering by status
- Filtering by urgency
- Geographic proximity searches
- Recent requests

### DonationRequest Indexes
- Donor's incoming requests
- Recipient's responses
- Status-based filtering
- Chronological ordering

### Chat Indexes
- User conversation retrieval
- Conversation threading
- Recent messages

---

## Data Retention

### Active Data
- User accounts: Indefinite (soft delete with `isActive` flag)
- Blood requests: 30 days after completion/cancellation
- Donation requests: 30 days after completion/cancellation
- Chat messages: 90 days

### Backup Strategy
- Daily automated backups (MongoDB Atlas recommended)
- Point-in-time recovery enabled
- Cross-region replication

---

## Scaling Considerations

### Horizontal Scaling
- Sharding by geography (city/state)
- Sharding by user role
- Sharding by timestamp

### Vertical Scaling
- Increase read replicas for read-heavy operations
- Optimize indexes for slow queries
- Archive old chat data

### Query Optimization
- Use covered queries where possible
- Lazy load nested documents
- Implement pagination for large result sets

---

## Security

### Password Storage
- Never stored in plain text
- Hashed with bcryptjs (salt: 10)
- Compared using safe comparison function

### Email Verification
- Recommended: Implement email verification on registration
- Current: Assumed verified through sign-up process

### Data Privacy
- GDPR compliance: Soft delete option
- Role-based access control
- Audit logging recommended

---

## Migration Guide

### Adding a New Field
```javascript
// Example: Add verification status
db.users.updateMany({}, { $set: { isVerified: true } })
```

### Renaming a Field
```javascript
// Example: Rename 'phone' to 'phoneNumber'
db.users.updateMany({}, { $rename: { "phone": "phoneNumber" } })
```

### Removing a Field
```javascript
// Example: Remove deprecated field
db.users.updateMany({}, { $unset: { "deprecatedField": 1 } })
```

---

## Connection String Format

```
mongodb+srv://username:password@cluster.mongodb.net/bloodly?retryWrites=true&w=majority
```

Environment Variable:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bloodly
```
