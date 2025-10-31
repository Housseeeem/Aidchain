# AidChain API Documentation

Base URL: `http://localhost:4000`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Register
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "researcher" // optional: "hospital" or "researcher"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "firstName": "John",
  "lastName": "Doe",
  "role": "researcher"
}
```

### Login
**POST** `/auth/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "firstName": "John",
  "lastName": "Doe",
  "role": "researcher"
}
```

---

## Datasets

### Upload Dataset
**POST** `/datasets`
🔒 **Protected** - Requires authentication

Upload a new dataset with file.

**Request:** `multipart/form-data`
- `file`: Dataset file (CSV, JSON, XLSX, XML, TXT, ZIP) - max 100MB
- `datasetName`: Name of the dataset
- `description`: Optional description
- `access`: Boolean - true for public, false for private (default: true)
- `price`: Number - price in credits (default: 0)

**Response:** `201 Created`
```json
{
  "message": "Dataset uploaded successfully",
  "dataset": {
    "id": "507f1f77bcf86cd799439011",
    "datasetName": "COVID-19 Patient Data",
    "description": "Anonymized patient records",
    "access": true,
    "price": 0,
    "sizeFile": "2.45 MB",
    "ownerUsername": "hospital@example.com"
  }
}
```

### List All Datasets
**GET** `/datasets`

Get all available datasets.

**Response:** `200 OK`
```json
{
  "datasets": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "datasetName": "COVID-19 Patient Data",
      "description": "Anonymized patient records",
      "access": true,
      "price": 0,
      "sizeFile": "2.45 MB",
      "ownerUsername": "hospital@example.com",
      "downloads": 15
    }
  ]
}
```

### Get Dataset Details
**GET** `/datasets/:id`

Get detailed information about a specific dataset.

**Response:** `200 OK`
```json
{
  "dataset": {
    "_id": "507f1f77bcf86cd799439011",
    "datasetName": "COVID-19 Patient Data",
    "description": "Anonymized patient records",
    "access": true,
    "price": 0,
    "sizeFile": "2.45 MB",
    "ownerUsername": "hospital@example.com",
    "downloads": 15
  }
}
```

### Get My Datasets
**GET** `/datasets/my/uploads`
🔒 **Protected** - Requires authentication

Get all datasets uploaded by the current user.

**Response:** `200 OK`
```json
{
  "datasets": [...]
}
```

### Download Dataset
**GET** `/datasets/:id/download`
🔒 **Protected** - Requires authentication

Download a dataset file. Access control is enforced:
- Dataset owner: Always allowed
- Public datasets (access=true): Anyone authenticated
- Private datasets (access=false): Requires approved access request

**Response:** File download or error message

**Possible Errors:**
- `403 Forbidden`: "Access denied. Please request access first."
- `404 Not Found`: "Dataset not found"

### Delete Dataset
**DELETE** `/datasets/:id`
🔒 **Protected** - Requires authentication (owner only)

Delete a dataset and its file.

**Response:** `200 OK`
```json
{
  "message": "Dataset deleted successfully"
}
```

---

## Access Requests

### Request Access
**POST** `/requests`
🔒 **Protected** - Requires authentication

Request access to a private dataset.

**Request Body:**
```json
{
  "datasetId": "507f1f77bcf86cd799439011"
}
```

**Response:** `201 Created`
```json
{
  "message": "Access request submitted successfully",
  "request": {
    "id": "507f191e810c19729de860ea",
    "datasetId": "507f1f77bcf86cd799439011",
    "username": "researcher@example.com",
    "approved": false
  }
}
```

**Possible Errors:**
- `400 Bad Request`: Dataset is public or you own it
- `409 Conflict`: Request already exists

### Get My Requests
**GET** `/requests/my`
🔒 **Protected** - Requires authentication

Get all access requests made by the current user.

**Response:** `200 OK`
```json
{
  "requests": [
    {
      "_id": "507f191e810c19729de860ea",
      "datasetId": {
        "_id": "507f1f77bcf86cd799439011",
        "datasetName": "COVID-19 Patient Data",
        "description": "Anonymized patient records",
        "ownerUsername": "hospital@example.com"
      },
      "username": "researcher@example.com",
      "approved": false
    }
  ]
}
```

### Get Pending Requests
**GET** `/requests/pending`
🔒 **Protected** - Requires authentication

Get all pending access requests for datasets owned by the current user.

**Response:** `200 OK`
```json
{
  "requests": [
    {
      "_id": "507f191e810c19729de860ea",
      "datasetId": {
        "_id": "507f1f77bcf86cd799439011",
        "datasetName": "COVID-19 Patient Data",
        "description": "Anonymized patient records"
      },
      "username": "researcher@example.com",
      "approved": false
    }
  ]
}
```

### Get Dataset Requests
**GET** `/requests/dataset/:datasetId`
🔒 **Protected** - Requires authentication (owner only)

Get all access requests for a specific dataset.

**Response:** `200 OK`
```json
{
  "requests": [...]
}
```

### Approve Request
**PUT** `/requests/:requestId/approve`
🔒 **Protected** - Requires authentication (dataset owner only)

Approve an access request.

**Response:** `200 OK`
```json
{
  "message": "Request approved successfully",
  "request": {
    "id": "507f191e810c19729de860ea",
    "datasetId": "507f1f77bcf86cd799439011",
    "username": "researcher@example.com",
    "approved": true
  }
}
```

### Reject Request
**DELETE** `/requests/:requestId`
🔒 **Protected** - Requires authentication (dataset owner only)

Reject/delete an access request.

**Response:** `200 OK`
```json
{
  "message": "Request rejected successfully"
}
```

---

## Health Check

### Get API Status
**GET** `/`

Check if the API is running.

**Response:** `200 OK`
```json
{
  "status": "AidChain API running",
  "version": "1.0.0",
  "uploadsDir": "./uploads",
  "hederaEnabled": true
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Invalid credentials
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

---

## Blockchain Integration (Hedera)

When Hedera is configured, the following events are logged to the blockchain:
- **Dataset Upload**: Records dataset ID, name, owner, and file hash
- **Access Request**: Records request ID, dataset ID, and requester
- **Access Approval**: Records approval with approver information
- **Dataset Download**: Records download events with user information

All blockchain logging is non-blocking and won't affect API performance if it fails.
