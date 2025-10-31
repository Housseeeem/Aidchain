# 🧠 AidChain – Secure AI-powered Medical Data Sharing on Hedera

 **AI + Blockchain for healthcare**  
 AidChain enables hospitals and researchers to securely share anonymized medical datasets with verifiable integrity and transparent access control through **Hedera Hashgraph**.

---

## 🚀 Overview

**Problem:**  
Healthcare data is locked due to privacy regulations and lack of trust. Researchers struggle to access anonymized datasets for AI innovation.

**Solution:**  
AidChain combines **AI-driven anonymization** and **Hedera blockchain integration** to ensure:
- ✅ Automated and compliant anonymization (NER + k-anonymity + differential privacy)
- 🔐 Off-chain encrypted storage of sensitive data
- 🧾 On-chain proofs (hash, metadata, access logs)
- 🎟️ Tokenized access permissions using Hedera Token Service (HTS)

---

## 🏗️ System Architecture

### Current Implementation:
```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend (Port 3000)              │
│  - User Authentication (Login/Register)                     │
│  - File Upload Interface                                    │
│  - Access Request Management                                │
│  - Admin Dashboard                                          │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API (Axios)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                 Express.js Backend (Port 5000)               │
│  - JWT Authentication                                       │
│  - File Upload (Multer)                                     │
│  - Access Control Logic                                     │
│  - MongoDB Integration                                      │
└──────────────┬───────┬────────────────┬─────────────────────┘
               │       │                │
               │       ▼                ▼
               │  ┌────────────────┐  ┌──────────────────┐
               │  │    MongoDB     │  │ Hedera Hashgraph │
               │  │   (Mongoose)   │  │  (HCS + HTS)     │
               │  │                │  │   [Testnet]      │
               │  │ - Users        │  │                  │
               │  │ - Files        │  │ - File Hashes    │
               │  │ - Access Reqs  │  │ - Access Tokens  │
               │  └────────────────┘  └──────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│           AI Anonymization Service (Port 8000)               │
│  - BioBERT NER for PHI Detection                            │
│  - K-Anonymity Algorithm                                    │
│  - Differential Privacy Noise Injection                     │
│  - PDF Text Extraction (pdfplumber)                         │
└─────────────────────────────────────────────────────────────┘
```

### Components:
| Component | Technology | Status |
|-----------|------------|--------|
| **Frontend** | Next.js 15+ with App Router | ✅ Implemented |
| **Backend API** | Express.js with JWT auth | ✅ Implemented |
| **Database** | MongoDB with Mongoose | ✅ Implemented |
| **AI Anonymizer** | FastAPI microservice | ✅ Implemented |
| **File Storage** | Local filesystem (encrypted) | ⏳ In Progress |
| **Blockchain** | Hedera HCS for file integrity | 🔄 Stubbed |
| **Access Tokens** | Hedera HTS for permissions | 📋 Planned |

---

## 🧩 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | Next.js 15+ (React 19+) + Tailwind CSS |
| **Backend** | Express.js (Node.js) + MongoDB (Mongoose) |
| **Database** | MongoDB |
| **Authentication** | JWT (jsonwebtoken) + bcryptjs |
| **File Upload** | Multer |
| **Blockchain** | Hedera Hashgraph SDK (@hashgraph/sdk) |
| **AI Service** | FastAPI (Python) - **✅ Implemented** |
| **AI Models** | BioBERT, Med7 (spaCy), K-anonymity, Differential Privacy |
| **Storage** | Local filesystem (MinIO/S3 migration planned) |



---

## ⚙️ Quick Start

### 📖 Detailed Setup Instructions

For complete setup instructions, see **[SETUP.md](./SETUP.md)**

### 🚀 Quick Setup (TL;DR)

```bash
# 1. Clone the repository
git clone https://github.com/Housseeeem/AidChain.git
cd AidChain

# 2. Backend setup
cd aidchain-backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URL and JWT secret
npm run dev  # Starts on http://localhost:5000

# 3. Frontend setup (new terminal)
cd ../aidchain-frontend
npm install
cp .env.local.example .env.local
npm run dev  # Starts on http://localhost:3000
```

**Prerequisites**: Node.js 18+, MongoDB 6+

**Note**: Make sure MongoDB is running before starting the backend.

---

## 🔌 API Endpoints

### Authentication
- `POST /users/register` - Create new user account
- `POST /users/login` - Authenticate and receive JWT token

### File Management (In Progress)
- `POST /files/upload` - Upload medical data file (requires auth)
- `GET /files/:id` - Get file metadata (requires auth)
- `GET /files/:id/download` - Download file if authorized (requires auth)
- `GET /files` - List user's files (requires auth)

### Access Control (In Progress)
- `POST /access/request` - Request access to a file (requires auth)
- `POST /access/approve` - Approve access request (admin only, requires auth)
- `GET /access/requests` - List pending requests (requires auth)

**Full API Documentation**: See [`.github/copilot-instructions.md`](./.github/copilot-instructions.md#-api-endpoints-reference)

---

## 🤖 AI Anonymization Service

### Overview
AidChain includes a production-ready FastAPI microservice for medical data anonymization using state-of-the-art AI techniques.

### Features
- **🔍 PHI Detection**: BioBERT and Med7 (spaCy) models for Named Entity Recognition
- **🎭 K-Anonymity**: Generalization and suppression of quasi-identifiers
- **🔐 Differential Privacy**: Laplace noise injection for statistical privacy
- **📄 PDF Support**: Automatic text extraction from medical documents

### Running the AI Service

```bash
cd ai-anonymization-service
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### API Endpoints

- **Health Check**: `GET /health`
  ```json
  { "status": "healthy", "service": "AI Anonymization Service" }
  ```

- **Anonymize Data**: `POST /api/anonymize`
  ```json
  {
    "fileUrl": "path/to/medical/file.pdf",
    "anonymizationType": "full",
    "privacyLevel": "high"
  }
  ```

### Integration Status
- ✅ Service implemented and tested
- 🔄 Backend integration (next step)
- 📋 End-to-end file upload flow (planned)

---

## 📊 Current Status

### ✅ Implemented Features
- User registration and authentication (JWT-based)
- Secure password hashing with bcryptjs
- AI anonymization microservice (FastAPI)
- MongoDB integration with Mongoose ODM
- Protected API routes with authentication middleware
- Frontend pages: Login, Register, Upload, Requests, Admin
- Responsive UI with Tailwind CSS
- Centralized API client with Axios

### ⏳ In Progress
- File upload controller with AI service integration
- File encryption before storage
- Access request/approval system
- Admin dashboard functionality

### 📋 Planned Features
- **Hedera HCS Integration**: Record file hashes on blockchain
- **Hedera HTS Integration**: Issue tokenized access permissions
- **End-to-end Anonymization Flow**: Integrate AI service with file upload
- **Audit Dashboard**: Blockchain-verified access logs
- **Payment Integration**: HBAR micropayments for data access

---

## 🧠 Core Features (Roadmap)
| Feature | Description | Status |
|----------|--------------|--------|
| 🧩 **Upload** | Hospitals upload raw datasets for anonymization | ⏳ In Progress |
| 🤖 **AI Anonymization** | Automatic PHI (Protected Health Information) detection & replacement | ✅ Implemented |
| 🔗 **Blockchain Proof** | Dataset hash and metadata written on Hedera HCS (Consensus Service) | 🔄 Stubbed |
| 🪙 **Tokenized Access** | Permission tokens issued and managed via Hedera HTS (Token Service) | 📋 Planned |
| 🔍 **Audit Log** | All access and modification actions publicly verifiable on the Hedera network | 📋 Planned |
| 💬 **Research Portal** | Researchers request and obtain dataset access using their verified Hedera ID | ⏳ In Progress |


## ⚡ Future Enhancements

- 🔬 **Federated Learning on Anonymized Data**  
  Enable collaborative AI model training across multiple hospitals without sharing sensitive patient data.

- 💰 **Micropayments using HBAR**  
  Introduce tokenized incentives for hospitals, researchers, and patients contributing to the AidChain ecosystem.

- 🔏 **Differential Privacy Queries**  
  Allow analytics over patient data while maintaining privacy through noise-injected query systems.

- 🔁 **Data Provenance Visual Dashboard**  
  Provide real-time tracking and visualization of medical data lineage on Hedera for full transparency.

---

## 📁 Project Structure

```
AidChain/
├── aidchain-backend/           # Express.js REST API
│   ├── app.js                  # Main application entry
│   ├── db.js                   # MongoDB connection
│   ├── collections/            # Mongoose schemas (User, File)
│   ├── controllers/            # Business logic
│   ├── middleware/             # Auth & upload middleware
│   ├── routes/                 # API endpoints (users, files, access)
│   ├── utils/                  # Helpers (blockchain, encryption)
│   └── uploads/                # File storage directory
│
├── aidchain-frontend/          # Next.js application
│   ├── app/                    # Next.js App Router pages
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── upload/             # File upload interface
│   │   ├── requests/           # Access requests
│   │   └── admin/              # Admin dashboard
│   ├── components/             # React components
│   └── utils/                  # API client (Axios)
│
├── ai-anonymization-service/   # Python AI microservice (✅ Implemented)
│   ├── main.py                 # FastAPI application
│   ├── pipeline.py             # AI anonymization logic
│   ├── requirements.txt        # Python dependencies
│   └── get-pip.py              # Pip installer
│
├── .github/
│   └── copilot-instructions.md # AI development context
├── SETUP.md                    # Detailed setup guide
├── CONTRIBUTING.md             # Contribution guidelines
└── README.md                   # This file
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [SETUP.md](./SETUP.md) | Complete installation and configuration guide |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Development workflow and coding standards |
| [.github/copilot-instructions.md](./.github/copilot-instructions.md) | Full architecture, API docs, and best practices |

---

## 🤖 Copilot Context

This project uses a persistent context file for AI-assisted development.

See [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) for:
- Complete architecture and integration guidelines
- API endpoint documentation with examples
- Environment variable reference
- Development best practices and code patterns
- MongoDB schema definitions
- Hedera blockchain integration roadmap

**For Contributors**: Please review the Copilot instructions and [CONTRIBUTING.md](./CONTRIBUTING.md) before making changes to ensure consistency across the codebase.

---

## 🔐 Environment Configuration

### Backend (.env)
```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/aidchain
JWT_SECRET=your_secret_key_here
HEDERA_ACCOUNT_ID=0.0.YOUR_ACCOUNT_ID
HEDERA_PRIVATE_KEY=your_private_key_here
HEDERA_NETWORK=testnet
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**See `.env.example` files for complete configuration options.**

---

## 🧪 Testing

### Manual Testing
1. Start MongoDB: `mongod` or use MongoDB Atlas
2. Start backend: `cd aidchain-backend && npm run dev`
3. Start frontend: `cd aidchain-frontend && npm run dev`
4. Open browser: `http://localhost:3000`
5. Register a new user and test authentication

### Testing Checklist
- [ ] User registration works
- [ ] Login returns JWT token
- [ ] Protected routes require authentication
- [ ] Frontend stores token in localStorage
- [ ] API requests include Authorization header

**For comprehensive testing guide, see [CONTRIBUTING.md](./CONTRIBUTING.md#-testing-guidelines)**

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Development workflow
- Branch naming conventions
- Commit message standards
- Code style guidelines
- Pull request process

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🌐 Links & Resources

### Project Resources
- 📦 [GitHub Repository](https://github.com/Housseeeem/AidChain)
- 📖 [Setup Guide](./SETUP.md)
- 🤝 [Contributing Guide](./CONTRIBUTING.md)
- 🤖 [Copilot Instructions](./.github/copilot-instructions.md)

### Hedera Resources
- 🏆 [Hedera Africa Hackathon](https://dorahacks.io/hackathon/hederahackafrica/)
- 📘 [Hedera Developer Docs](https://docs.hedera.com/)
- 💬 [Hedera Discord Community](https://hedera.com/discord)
- 🔧 [Hedera Portal (Get Testnet Account)](https://portal.hedera.com/)
- 📚 [Hedera SDK Documentation](https://docs.hedera.com/hedera/sdks-and-apis/sdks)

### Technology Stack Resources
- ⚡ [Next.js Documentation](https://nextjs.org/docs)
- 🟢 [Express.js Guide](https://expressjs.com/)
- 🍃 [MongoDB Manual](https://www.mongodb.com/docs/manual/)
- 🎨 [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 👥 Team

Built for the **Hedera Africa Hackathon** by [Team AidChain]

---

## 🙏 Acknowledgments

- Hedera Hashgraph for providing blockchain infrastructure
- The open-source community for amazing tools and libraries
- Healthcare professionals who inspired this solution

---

**⭐ If you find this project useful, please give it a star on GitHub!**
