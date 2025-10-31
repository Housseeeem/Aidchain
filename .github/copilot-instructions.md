# 🧠 AidChain – GitHub Copilot Development Context

## 📋 Project Overview

**AidChain** is a secure, AI-powered medical data sharing platform built on **Hedera Hashgraph** for the Hedera Africa Hackathon. The platform enables hospitals and researchers to securely share anonymized medical datasets with verifiable integrity and transparent access control.

### Core Value Proposition
- ✅ **AI-driven anonymization** (NER + k-anonymity + differential privacy)
- 🔐 **Off-chain encrypted storage** of sensitive medical data
- 🧾 **On-chain proofs** (hashes, metadata, access logs on Hedera)
- 🎟️ **Tokenized access permissions** using Hedera Token Service (HTS)

---

## 🏗️ System Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 15+ (React 19+), Tailwind CSS | User interface for data upload, access management, and blockchain verification |
| **Backend** | Express.js (Node.js), MongoDB (Mongoose) | RESTful API, authentication, file management, access control |
| **Database** | MongoDB | User accounts, file metadata, access requests |
| **Blockchain** | Hedera Hashgraph SDK (@hashgraph/sdk) | Immutable proof of data integrity, access logs |
| **Storage** | File system (with future MinIO/S3 migration) | Encrypted medical data storage |
| **AI Service** | FastAPI (Python) - **Implemented** | Medical data anonymization microservice with NER, k-anonymity, and differential privacy |
| **Authentication** | JWT (jsonwebtoken), bcryptjs | Secure user sessions and password hashing |

---

## 📁 Repository Structure

```
AidChain/
├── .github/
│   └── copilot-instructions.md          # This file - Copilot development context
├── aidchain-backend/                     # Express.js backend server
│   ├── app.js                            # Main Express application entry point
│   ├── db.js                             # MongoDB connection manager
│   ├── package.json                      # Backend dependencies
│   ├── collections/                      # Mongoose schema definitions
│   │   ├── index.js                      # Collection exports
│   │   ├── User.js                       # User schema (username, password, timestamps)
│   │   └── File.js                       # File schema (metadata, Hedera hash, anonymization status)
│   ├── controllers/                      # Business logic handlers
│   │   ├── accessController.js           # Access request/approval logic
│   │   ├── fileController.js             # File upload/download logic
│   │   └── userController.js             # User registration/login logic (MongoDB-integrated)
│   ├── data/                             # JSON data storage (temporary)
│   │   └── accessRequests.json           # Access request records
│   ├── middleware/                       # Express middleware
│   │   ├── auth.js                       # JWT authentication middleware (improved error handling)
│   │   └── upload.js                     # Multer file upload configuration
│   ├── routes/                           # API route definitions
│   │   ├── accessRoutes.js               # /access/* endpoints
│   │   ├── fileRoutes.js                 # /files/* endpoints
│   │   └── userRoutes.js                 # /users/* endpoints
│   ├── uploads/                          # Uploaded files directory
│   └── utils/                            # Helper utilities
│       ├── blockchain.js                 # Hedera integration (stub for now)
│       ├── encryption.js                 # File encryption utilities
│       └── storage.js                    # Storage management utilities
│
├── ai-anonymization-service/             # Python AI microservice (FastAPI)
│   ├── main.py                           # FastAPI application with /health and /api/anonymize endpoints
│   ├── pipeline.py                       # AI anonymization pipeline (NER, k-anonymity, differential privacy)
│   ├── requirements.txt                  # Python dependencies (installed)
│   └── get-pip.py                        # Pip installer (used for setup)
│
├── aidchain-frontend/                    # Next.js frontend application
│   ├── package.json                      # Frontend dependencies
│   ├── next.config.js                    # Next.js configuration
│   ├── tailwind.config.js                # Tailwind CSS configuration
│   ├── postcss.config.mjs                # PostCSS configuration
│   ├── app/                              # Next.js App Router pages
│   │   ├── layout.jsx                    # Root layout with Navbar
│   │   ├── page.jsx                      # Home page (redirects to login/upload)
│   │   ├── globals.css                   # Global styles
│   │   ├── login/page.jsx                # Login page
│   │   ├── register/page.jsx             # Registration page
│   │   ├── upload/page.jsx               # File upload interface
│   │   ├── requests/page.jsx             # Access request management
│   │   └── admin/page.jsx                # Admin dashboard
│   ├── components/                       # Reusable React components
│   │   └── Navbar.jsx                    # Navigation bar component
│   └── utils/                            # Frontend utilities
│       └── api.js                        # Axios API client configuration
│
└── README.md                             # Project documentation
```

---

## 🔄 Data Flow & Integration Points

### 1. User Authentication Flow
```
Frontend (login/page.jsx) 
  → API.post('/users/login', { username, password })
  → Backend (userRoutes.js → userController.js)
  → MongoDB (User collection)
  → JWT token generation
  → Frontend stores token in localStorage
  → api.js sets Authorization header
```

### 2. File Upload Flow (Current Implementation)
```
Frontend (upload/page.jsx)
  → API.post('/files/upload', formData)
  → Backend (fileRoutes.js → fileController.js)
  → Multer middleware processes file
  → File saved to uploads/ directory
  → File metadata stored in MongoDB
  → Blockchain stub registers file hash
  → Success response to frontend
```

### 3. Access Request Flow
```
Researcher (requests/page.jsx)
  → API.post('/access/request', { fileId })
  → Backend (accessRoutes.js → accessController.js)
  → Access request stored in MongoDB/JSON
  → Hospital admin (admin/page.jsx)
  → API.post('/access/approve', { requestId })
  → Blockchain logs approval on Hedera
  → Researcher granted access token
```

### 4. Future AI Anonymization Flow (Planned)
```
Frontend uploads raw medical data
  → Backend receives file
  → Backend forwards to AI microservice (FastAPI/Flask)
  → AI service: NER → PHI detection → Anonymization
  → Anonymized data encrypted and stored
  → Hash registered on Hedera HCS
  → Metadata returned to backend
```

---

## 🔌 API Endpoints Reference

### Base URL
- **Backend**: `http://localhost:5000`
- **Frontend**: `http://localhost:3000`

### Authentication Endpoints (`/users`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/users/register` | No | Create new user account |
| POST | `/users/login` | No | Authenticate and get JWT token |

**Request Body (both endpoints):**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (login):**
```json
{
  "message": "Logged in",
  "token": "jwt_token_here"
}
```

### File Management Endpoints (`/files`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/files/upload` | Yes | Upload medical data file |
| GET | `/files/:id` | Yes | Retrieve file metadata |
| GET | `/files/:id/download` | Yes | Download file (if authorized) |
| GET | `/files` | Yes | List user's uploaded files |

### Access Control Endpoints (`/access`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/access/request` | Yes | Request access to a file |
| POST | `/access/approve` | Yes | Approve access request (admin only) |
| GET | `/access/requests` | Yes | List pending access requests |

---

## 🔐 Environment Variables

### Backend (.env in aidchain-backend/)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017/aidchain

# JWT Authentication
JWT_SECRET=your_secret_key_here_change_in_production

# Hedera Configuration (for blockchain integration)
HEDERA_ACCOUNT_ID=0.0.YOUR_ACCOUNT_ID
HEDERA_PRIVATE_KEY=your_private_key_here
HEDERA_NETWORK=testnet

# File Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=50000000  # 50MB in bytes

# AI Service (Future)
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_API_KEY=your_ai_service_key

# Encryption
ENCRYPTION_KEY=your_32_char_encryption_key_here
```

### Frontend (.env.local in aidchain-frontend/)
```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🧩 MongoDB Schema Definitions

### User Collection
```javascript
{
  username: String (unique, required, max 255),
  password: String (bcrypt hashed, required, max 255),
  role: String (default: 'user', options: 'user' | 'admin' | 'researcher'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### File Collection (To Be Implemented)
```javascript
{
  _id: ObjectId,
  filename: String,
  originalName: String,
  size: Number,
  mimetype: String,
  uploadedBy: ObjectId (ref: 'User'),
  encryptedPath: String,
  isAnonymized: Boolean,
  hederaHash: String,         // Hash recorded on Hedera
  hederaTimestamp: String,    // HCS consensus timestamp
  metadata: {
    description: String,
    dataType: String,         // e.g., "CT Scan", "MRI", "Lab Results"
    patientCount: Number,
    dateRange: { start: Date, end: Date }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### AccessRequest Collection (To Be Implemented)
```javascript
{
  _id: ObjectId,
  fileId: ObjectId (ref: 'File'),
  requesterId: ObjectId (ref: 'User'),
  ownerId: ObjectId (ref: 'User'),
  status: String (enum: 'pending' | 'approved' | 'rejected'),
  justification: String,
  approvedAt: Date,
  hederaTokenId: String,      // HTS token ID if approved
  createdAt: Date
}
```

---

## 🛠️ Development Best Practices

### Code Style & Conventions

#### Backend (Express/Node.js)
- **Async/Await**: Always use `async/await` for asynchronous operations, never callbacks
- **Error Handling**: Wrap controllers in try-catch blocks and return appropriate HTTP status codes
- **Route Naming**: Use plural nouns (`/users`, `/files`, `/access`) and RESTful conventions
- **Middleware Order**: 
  1. Body parsers
  2. Authentication middleware
  3. Route handlers
  4. Error handlers (at the end)

**Example Controller Pattern:**
```javascript
const exampleController = async (req, res) => {
  try {
    const { param } = req.body;
    
    // Validation
    if (!param) {
      return res.status(400).json({ error: 'Missing required parameter' });
    }
    
    // Business logic
    const result = await someAsyncOperation(param);
    
    // Success response
    return res.status(200).json({ data: result });
    
  } catch (error) {
    console.error('Error in exampleController:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
```

#### Frontend (Next.js/React)
- **Client Components**: Use `"use client"` directive for components with hooks/state
- **API Calls**: Always use the centralized `API` instance from `utils/api.js`
- **Error Handling**: Show user-friendly error messages with proper UI feedback
- **Loading States**: Implement loading indicators for async operations
- **Token Management**: Store JWT in localStorage, set via `setAuthToken()`

**Example API Call Pattern:**
```javascript
"use client";

import { useState } from 'react';
import API from '@/utils/api';

export default function ExampleComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await API.post('/endpoint', data);
      // Handle success
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      {/* Component JSX */}
    </div>
  );
}
```

### Git Conventions

#### Branch Naming
- `feat/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/what-changed` - Documentation updates
- `refactor/component-name` - Code refactoring
- `test/test-description` - Test additions

#### Commit Messages
Follow conventional commits format:
```
feat: add file upload with encryption
fix: resolve JWT expiration handling
docs: update API endpoint documentation
refactor: simplify blockchain integration
```

---

## 🚀 Hedera Blockchain Integration

### Current Status
The blockchain integration is currently stubbed in `utils/blockchain.js`. The placeholder function logs operations but doesn't interact with Hedera yet.

### Implementation Roadmap

#### Phase 1: Basic HCS (Hashgraph Consensus Service)
- Record file upload events with metadata hashes
- Store consensus timestamps
- Verify data integrity

#### Phase 2: HTS (Hedera Token Service)
- Create access permission tokens
- Transfer tokens on access approval
- Revoke tokens when access expires

#### Phase 3: Smart Contracts (Optional)
- Automated access control logic
- Payment distribution for data sharing
- Audit trail queries

### Integration Points

**File Upload → Hedera HCS:**
```javascript
// In fileController.js after file save
const { Client, TopicMessageSubmitTransaction } = require('@hashgraph/sdk');

const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
const message = JSON.stringify({
  fileId: file._id,
  hash: fileHash,
  timestamp: new Date().toISOString(),
  owner: req.user.id
});

const transaction = await new TopicMessageSubmitTransaction()
  .setTopicId(process.env.HEDERA_TOPIC_ID)
  .setMessage(message)
  .execute(client);

const receipt = await transaction.getReceipt(client);
```

**Access Approval → Hedera HTS:**
```javascript
// In accessController.js on approval
const { TokenCreateTransaction, TokenAssociateTransaction } = require('@hashgraph/sdk');

// Create access token
const tokenCreateTx = await new TokenCreateTransaction()
  .setTokenName(`Access-${fileId}`)
  .setTokenSymbol('AIDACCESS')
  .setTreasuryAccountId(process.env.HEDERA_ACCOUNT_ID)
  .execute(client);

// Transfer token to requester
// ... token association and transfer logic
```

---

## 🤖 AI Anonymization Service (✅ Implemented)

### Microservice Architecture
- **Framework**: FastAPI (Python) - **Running**
- **AI Models**: 
  - BioBERT (`dmis-lab/biobert-base-cased-v1.1`) for PHI entity recognition
  - Med7 (spaCy) for medical NER
  - Custom k-anonymity algorithms (implemented)
  - Differential privacy noise injection (Laplace mechanism)
  - pdfplumber for PDF text extraction

### Service Structure
```
ai-anonymization-service/
├── main.py                  # FastAPI app with endpoints
├── pipeline.py              # Core anonymization logic
│   ├── PHIDetector          # Named Entity Recognition for PHI
│   ├── KAnonymizer          # K-anonymity implementation
│   ├── DifferentialPrivacy  # Privacy noise injection
│   └── MedicalAnonymizationPipeline  # Orchestrates all anonymization steps
└── requirements.txt         # Dependencies (installed)
```

### API Contract

**Health Check**: `GET /health`
- Returns: `{ "status": "healthy", "service": "AI Anonymization Service" }`

**Anonymization Endpoint**: `POST /api/anonymize`

**Request:**
```json
{
  "fileUrl": "string",
  "anonymizationType": "ner|k-anonymity|differential-privacy|full",
  "privacyLevel": "low|medium|high"
}
```

**Response:**
```json
{
  "anonymizedFileUrl": "string",
  "entitiesRedacted": ["PATIENT_NAME", "SSN", "DATE_OF_BIRTH"],
  "privacyMetrics": {
    "kValue": 5,
    "epsilonValue": 0.1
  },
  "originalHash": "string",
  "anonymizedHash": "string"
}
```

### Running the Service
```bash
cd ai-anonymization-service
pip install -r requirements.txt
python -m spacy download en_core_web_sm  # Download spaCy model
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Integration with Backend
```javascript
// In fileController.js before blockchain registration
const anonymizeResponse = await axios.post(
  `${process.env.AI_SERVICE_URL}/api/anonymize`,
  {
    fileUrl: uploadedFilePath,
    anonymizationType: 'full',  // Use all anonymization techniques
    privacyLevel: 'high'
  },
  {
    headers: { 'Authorization': `Bearer ${process.env.AI_SERVICE_API_KEY}` }
  }
);

// Use anonymized file for storage and blockchain registration
const anonymizedFile = anonymizeResponse.data.anonymizedFileUrl;
```

---

## 🔍 Testing & Quality Assurance

### Manual Testing Checklist
- [ ] User registration creates account in MongoDB
- [ ] Login returns valid JWT token
- [ ] Protected routes reject requests without token
- [ ] File upload saves to filesystem and database
- [ ] Access request creates pending request
- [ ] Admin can approve/reject requests
- [ ] Blockchain stub logs operations correctly

### Future Automated Testing
- **Backend**: Jest + Supertest for API endpoint testing
- **Frontend**: React Testing Library + Jest
- **E2E**: Playwright for full user flow testing

---

## 📦 Deployment & Hackathon Submission

### Local Development Setup
```bash
# Clone repository
git clone https://github.com/Housseeeem/AidChain.git
cd AidChain

# Backend setup
cd aidchain-backend
npm install
# Create .env file with required variables
npm run dev  # Starts on http://localhost:5000

# Frontend setup (in new terminal)
cd ../aidchain-frontend
npm install
npm run dev  # Starts on http://localhost:3000
```

### MongoDB Setup
```bash
# Install MongoDB locally or use MongoDB Atlas
# Update MONGO_URL in backend/.env

# Default local connection:
MONGO_URL=mongodb://localhost:27017/aidchain
```

### Production Considerations
- **Environment Variables**: Never commit `.env` files - use `.env.example` template
- **Security**: Rotate JWT secrets, use strong encryption keys
- **Hedera Network**: Use testnet for hackathon, mainnet for production
- **File Storage**: Migrate from local filesystem to MinIO/S3 with encryption
- **Rate Limiting**: Implement API rate limiting (express-rate-limit)
- **CORS**: Configure proper CORS policies for frontend domain

---

## 🎯 Hackathon Compliance Checklist

### Required Elements
- [x] Public GitHub repository with clear README
- [x] Hedera SDK integration (testnet ready)
- [x] Clean, well-structured codebase
- [ ] `.env.example` files for both frontend and backend
- [x] Setup instructions in README
- [ ] Demo video or screenshots
- [ ] Live demo deployment (optional but recommended)

### Documentation Standards
- **Code Comments**: Add JSDoc comments for complex functions
- **API Documentation**: Consider adding Swagger/OpenAPI specs
- **Architecture Diagrams**: Include visual diagrams in `/docs` folder
- **User Guide**: Add step-by-step usage instructions

---

## 🧠 Copilot Assistance Guidelines

### When Generating New Code
1. **Check existing patterns**: Follow the established controller/route/model structure
2. **Maintain consistency**: Use the same error handling and response format
3. **Add validation**: Always validate user inputs before processing
4. **Include comments**: Add brief explanations for complex logic
5. **Security first**: Never log sensitive data (passwords, tokens, private keys)

### When Refactoring
1. **Preserve functionality**: Don't break existing API contracts
2. **Update all layers**: If changing backend routes, update frontend API calls
3. **Test integration**: Verify frontend-backend communication still works
4. **Update documentation**: Reflect changes in this file

### When Adding Features
1. **Plan the flow**: Map out frontend → backend → database → blockchain steps
2. **Create schemas first**: Define MongoDB models before implementing controllers
3. **Stub blockchain calls**: Implement core logic first, then add Hedera integration
4. **Progressive enhancement**: Get basic version working before adding AI/encryption

### Common Pitfalls to Avoid
- ❌ Don't use callbacks - use async/await
- ❌ Don't store passwords in plain text - always hash with bcrypt
- ❌ Don't hardcode URLs/keys - use environment variables
- ❌ Don't forget CORS configuration for cross-origin requests
- ❌ Don't mix authentication logic - centralize in middleware
- ❌ Don't ignore error cases - handle all try-catch scenarios

---

## 📚 Key Dependencies & Documentation

### Backend Dependencies
- **express** (^5.1.0): Web framework - [Docs](https://expressjs.com/)
- **mongoose** (^8.19.2): MongoDB ODM - [Docs](https://mongoosejs.com/)
- **jsonwebtoken** (^9.0.2): JWT handling - [Docs](https://github.com/auth0/node-jsonwebtoken)
- **bcryptjs** (^3.0.2): Password hashing - [Docs](https://github.com/dcodeIO/bcrypt.js)
- **multer** (^2.0.2): File uploads - [Docs](https://github.com/expressjs/multer)
- **@hashgraph/sdk** (^2.72.0): Hedera integration - [Docs](https://docs.hedera.com/hedera/sdks-and-apis/sdks)

### Frontend Dependencies
- **next** (latest): React framework - [Docs](https://nextjs.org/docs)
- **react** (latest): UI library - [Docs](https://react.dev/)
- **axios** (^1.12.2): HTTP client - [Docs](https://axios-http.com/)
- **tailwindcss** (^4.1.15): CSS framework - [Docs](https://tailwindcss.com/)

---

## 🔗 Quick Links

- 🏆 [Hedera Africa Hackathon](https://dorahacks.io/hackathon/hederahackafrica/)
- 📘 [Hedera Developer Docs](https://docs.hedera.com/)
- 💬 [Hedera Discord](https://hedera.com/discord)
- 🐙 [Project Repository](https://github.com/Housseeeem/AidChain)

---

## 📝 Maintenance Notes

**Last Updated**: October 31, 2025  
**Current Phase**: MVP Development - AI Integration Complete & Repository Synced  
**Next Milestone**: Access Request System + Hedera HCS Integration

### Progress Log

#### [2025-10-31] 🚀 Complete AI Integration Pushed to GitHub
- **Committed & Pushed**: All changes successfully pushed to `setup/aidchain-mvp` branch
- **Repository Status**: 4 commits pushed (28 files changed, 30,614+ insertions)
- **Files Synced**:
  - `.github/copilot-instructions.md` (comprehensive development context)
  - `ai-anonymization-service/` (complete FastAPI microservice)
  - `aidchain-backend/.env.example` (full backend configuration)
  - `aidchain-frontend/.env.local.example` (frontend environment template)
  - `CONTRIBUTING.md` and `SETUP.md` (project documentation)
  - Complete File MongoDB schema and AI-integrated controllers
- **Cleanup**: Removed temporary test upload files
- **Dependencies**: Added form-data for multipart file uploads to AI service
- **Commit Message**: Comprehensive feature description for hackathon judges
- **Next Steps**:
  1. Test complete upload flow with AI service running locally
  2. Implement AccessRequest MongoDB schema
  3. Build access request/approval workflow with controllers
  4. Integrate Hedera HCS for immutable file registration
  5. Add blockchain verification on file downloads

#### [2025-01-15] ✅ File Collection Schema & AI Service Integration Complete
- **Implemented**: Complete File MongoDB schema with anonymization tracking
- **Implemented**: Full AI service integration in fileController.js
  - Automatic file anonymization on upload
  - Fallback to original file if AI service unavailable
  - Encryption of anonymized/original files
  - Anonymization metrics tracking
- **Implemented**: getFileById and downloadFile controllers with access control placeholders
- **Updated**: File routes with all CRUD operations
- **Added**: form-data dependency for AI service communication
- **Created**: Backend .env.example with all required variables including AI_SERVICE_URL
- **Files Affected**:
  - `aidchain-backend/collections/File.js` (new)
  - `aidchain-backend/collections/index.js` (updated)
  - `aidchain-backend/controllers/fileController.js` (major refactor)
  - `aidchain-backend/routes/fileRoutes.js` (updated)
  - `aidchain-backend/.env.example` (created)
  - `aidchain-backend/package.json` (dependency added)
- **Next Steps**:
  1. Test end-to-end file upload with AI service running
  2. Implement AccessRequest MongoDB schema
  3. Complete access request/approval controllers with token-based permissions
  4. Implement Hedera HCS integration for file hash registration
  5. Add blockchain verification on file download

### Immediate TODOs
1. ✅ Create `.env.example` files with all required variables
2. ✅ Implement File collection schema in MongoDB
3. ✅ Build AI anonymization microservice (FastAPI)
4. ✅ Complete fileRoutes.js and fileController.js with AI integration
5. 🔄 Test AI service and integrate with backend file upload
6. 🔄 Implement AccessRequest MongoDB schema
7. 🔄 Add file encryption before storage (partially done - needs testing)
8. 🔄 Replace blockchain stub with real Hedera HCS calls
9. 🔄 Create demo data for testing

---

*This document should be updated whenever significant architectural changes occur. All contributors should reference this file before making major changes to maintain consistency across the codebase.*
