# AidChain Backend Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy the example environment file and configure your settings:
```bash
cp .env.example .env
```

Edit `.env` and set:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT signing
- `HEDERA_*`: Optional - Hedera credentials for blockchain features

### 3. Start MongoDB
Make sure MongoDB is running:
```bash
# If using local MongoDB
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 4. Seed Admin User (Optional)
```bash
node src/utils/seedUser.js
```

### 5. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run at `http://localhost:4000`

---

## 📚 API Documentation

See [API_DOCS.md](./API_DOCS.md) for complete API reference.

---

## ✨ Features Implemented

### ✅ Authentication
- User registration
- User login with JWT
- Protected routes with middleware

### ✅ Dataset Management
- Upload datasets (CSV, JSON, XLSX, XML, TXT, ZIP)
- List all datasets
- Get dataset details
- Download datasets with access control
- Delete datasets (owner only)
- View my uploaded datasets

### ✅ Access Control
- Request access to private datasets
- Approve/reject access requests
- View pending requests
- View my requests

### ✅ Blockchain Integration (Hedera)
- Log dataset uploads to blockchain
- Log access requests to blockchain
- Log access approvals to blockchain
- Log dataset downloads to blockchain
- File integrity verification with SHA-256 hashing

---

## 🗂️ Project Structure

```
aidchain-backend/
├── src/
│   ├── app.js                 # Main application entry
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js # JWT authentication
│   ├── models/
│   │   ├── Dataset.js        # Dataset schema
│   │   ├── DatasetRequest.js # Access request schema
│   │   └── User.js           # User schema
│   ├── routes/
│   │   ├── auth.js           # Authentication endpoints
│   │   ├── datasets.js       # Dataset CRUD endpoints
│   │   └── requests.js       # Access request endpoints
│   ├── services/
│   │   └── hederaService.js  # Blockchain integration
│   └── utils/
│       ├── crypto.js         # File hashing utilities
│       ├── jwt.js            # JWT utilities
│       └── seedUser.js       # Database seeding
├── uploads/                   # Uploaded files directory
├── .env.example              # Environment template
├── API_DOCS.md               # API documentation
├── package.json
└── README.md
```

---

## 🔐 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT-based authentication
- Role-based access control (hospital/researcher)
- File type validation
- File size limits (100MB)
- Owner-only deletion
- Access control for private datasets

---

## 🌐 Hedera Blockchain Setup (Optional)

1. Create a Hedera testnet account at [portal.hedera.com](https://portal.hedera.com/)
2. Get your Account ID and Private Key
3. Add to `.env`:
   ```
   HEDERA_ACCOUNT_ID=0.0.xxxxx
   HEDERA_PRIVATE_KEY=302e020100300506032b657004220420...
   HEDERA_NETWORK=testnet
   ```
4. The system will auto-create a topic on first run
5. Copy the topic ID to `.env` as `HEDERA_TOPIC_ID`

**Note:** Blockchain features are optional. The API works without Hedera configuration.

---

## 🧪 Testing the API

### Using curl:

**Register:**
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User",
    "role": "researcher"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Upload Dataset:**
```bash
curl -X POST http://localhost:4000/datasets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@./path/to/dataset.csv" \
  -F "datasetName=Test Dataset" \
  -F "description=Sample dataset" \
  -F "access=true" \
  -F "price=0"
```

**List Datasets:**
```bash
curl http://localhost:4000/datasets
```

---

## 🔧 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connectivity

### File Upload Error
- Check `UPLOAD_DIR` exists and is writable
- Verify file size is under 100MB
- Ensure file type is supported

### JWT Errors
- Verify `JWT_SECRET` is set in `.env`
- Check token format: `Bearer <token>`
- Token might be expired

### Hedera Errors (Optional)
- Verify credentials are correct
- Check network connectivity to Hedera
- Ensure account has sufficient HBAR balance

---

## 📝 Development Notes

### Adding New Routes
1. Create route file in `src/routes/`
2. Register in `src/app.js`
3. Add authentication middleware if needed

### Database Models
- Models are in `src/models/`
- Use Mongoose schemas
- Add validation as needed

### Middleware
- Add custom middleware in `src/middleware/`
- Register globally in `app.js` or per-route

---

## 📄 License

ISC License - See LICENSE file for details

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📧 Support

For issues or questions, please open an issue on GitHub.
