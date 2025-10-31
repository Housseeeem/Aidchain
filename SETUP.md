# 🚀 AidChain - Quick Setup Guide

This guide will help you set up the AidChain development environment on your local machine.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - Alternatively, use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)
- **Git** - [Download](https://git-scm.com/downloads)
- **npm** or **yarn** package manager (comes with Node.js)

---

## 🛠️ Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Housseeeem/AidChain.git
cd AidChain
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd aidchain-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
# At minimum, set:
# - MONGO_URL (your MongoDB connection string)
# - JWT_SECRET (generate a random secret)
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd aidchain-frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local if your backend runs on a different port
# Default: NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service
# On Windows:
net start MongoDB

# On macOS (using Homebrew):
brew services start mongodb-community

# On Linux (systemd):
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGO_URL` in `aidchain-backend/.env`

---

## ▶️ Running the Application

### Start Backend Server

```bash
# From aidchain-backend directory
npm run dev

# Server will start on http://localhost:5000
```

You should see:
```
Server running on port 5000
MongoDB connection established successfully.
```

### Start Frontend Application

```bash
# From aidchain-frontend directory (in a new terminal)
npm run dev

# Frontend will start on http://localhost:3000
```

You should see:
```
✓ Ready in 2.5s
○ Local:        http://localhost:3000
```

---

## 🧪 Testing the Setup

### 1. Access the Application

Open your browser and navigate to: `http://localhost:3000`

### 2. Register a New User

- Click "Register" from the navigation
- Create a test account (e.g., username: `testuser`, password: `password123`)

### 3. Login

- Use your credentials to log in
- You should be redirected to the upload page

### 4. Test File Upload (when implemented)

- Navigate to the Upload page
- Try uploading a test file
- Check MongoDB to verify the file metadata is stored

### 5. Verify Backend API

Visit: `http://localhost:5000`

You should see: `AidChain Backend is running!`

---

## 🔍 Troubleshooting

### MongoDB Connection Issues

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solutions:**
- Ensure MongoDB service is running
- Check your `MONGO_URL` in `.env`
- Verify MongoDB is listening on port 27017:
  ```bash
  netstat -an | grep 27017
  ```

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
- Stop any process using port 5000 or 3000
- Change the port in `.env` (backend) or `.env.local` (frontend)

**Find and kill process (Linux/macOS):**
```bash
lsof -ti:5000 | xargs kill -9
```

**Find and kill process (Windows):**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### JWT Token Issues

**Error:** `JsonWebTokenError: invalid signature`

**Solution:**
- Make sure `JWT_SECRET` is set in `.env`
- Clear localStorage in browser (F12 → Application → Local Storage → Clear)

### CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
- Ensure backend is running on port 5000
- Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Check that `FRONTEND_URL` is set correctly in backend `.env`

---

## 📦 Project Structure Overview

```
AidChain/
├── aidchain-backend/         # Express.js backend
│   ├── .env                  # Backend environment variables (create from .env.example)
│   ├── app.js                # Main server entry point
│   ├── db.js                 # MongoDB connection
│   ├── collections/          # Mongoose models
│   ├── controllers/          # Business logic
│   ├── middleware/           # Auth & file upload middleware
│   ├── routes/               # API endpoints
│   ├── utils/                # Helper functions
│   └── uploads/              # Uploaded files storage
│
├── aidchain-frontend/        # Next.js frontend
│   ├── .env.local            # Frontend environment variables (create from .env.local.example)
│   ├── app/                  # Next.js pages (App Router)
│   ├── components/           # React components
│   └── utils/                # API client & utilities
│
└── .github/
    └── copilot-instructions.md  # Development guidelines
```

---

## 🔐 Hedera Integration Setup (Optional)

To enable Hedera blockchain features:

1. **Create Hedera Account**
   - Visit [Hedera Portal](https://portal.hedera.com/)
   - Create a testnet account (free)
   - Get your Account ID and Private Key

2. **Update Backend .env**
   ```env
   HEDERA_ACCOUNT_ID=0.0.YOUR_ACCOUNT_ID
   HEDERA_PRIVATE_KEY=your_private_key_here
   HEDERA_NETWORK=testnet
   ```

3. **Create HCS Topic** (for file hashes)
   ```javascript
   // Run this script once to create a topic
   const { Client, TopicCreateTransaction } = require('@hashgraph/sdk');
   
   const client = Client.forTestnet();
   client.setOperator(accountId, privateKey);
   
   const transaction = await new TopicCreateTransaction()
     .setTopicMemo("AidChain File Registry")
     .execute(client);
   
   const receipt = await transaction.getReceipt(client);
   console.log("Topic ID:", receipt.topicId.toString());
   ```

4. **Save Topic ID** in `.env`:
   ```env
   HEDERA_TOPIC_ID=0.0.YOUR_TOPIC_ID
   ```

---

## 📚 Next Steps

1. **Review Architecture**: Read [`.github/copilot-instructions.md`](../.github/copilot-instructions.md)
2. **Implement Missing Features**:
   - File upload controller and routes
   - Access request/approval system
   - Real Hedera HCS integration
3. **Add Tests**: Set up Jest for backend and frontend
4. **Deploy**: Consider deployment options (Vercel, Heroku, AWS)

---

## 🆘 Getting Help

- **Documentation**: Check `.github/copilot-instructions.md`
- **Issues**: [GitHub Issues](https://github.com/Housseeeem/AidChain/issues)
- **Hedera Support**: [Hedera Discord](https://hedera.com/discord)
- **Hackathon**: [Hedera Africa Hackathon Forum](https://dorahacks.io/hackathon/hederahackafrica/)

---

## ✅ Setup Complete!

You're now ready to develop AidChain features. Happy coding! 🚀

For development best practices and contribution guidelines, see [`.github/copilot-instructions.md`](../.github/copilot-instructions.md).
