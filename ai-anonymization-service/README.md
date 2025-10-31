# 🤖 AidChain AI Anonymization Service

A production-ready FastAPI microservice for medical data anonymization using state-of-the-art AI techniques.

## 🎯 Overview

This service provides comprehensive anonymization of Protected Health Information (PHI) in medical documents using multiple privacy-preserving techniques:

- **Named Entity Recognition (NER)**: BioBERT and Med7 models for PHI detection
- **K-Anonymity**: Generalization and suppression of quasi-identifiers
- **Differential Privacy**: Laplace noise injection for statistical privacy guarantees
- **PDF Processing**: Automatic text extraction from medical documents

## 🏗️ Architecture

```
pipeline.py
├── PHIDetector              # NER-based PHI detection
│   ├── BioBERT tokenizer    # Medical entity recognition
│   └── Med7 (spaCy)         # Additional medical NER
├── KAnonymizer              # K-anonymity implementation
│   ├── Generalization       # Quasi-identifier generalization
│   └── Suppression          # Direct identifier removal
├── DifferentialPrivacy      # Privacy noise injection
│   └── Laplace mechanism    # Epsilon-based noise
└── MedicalAnonymizationPipeline
    └── Orchestrates all anonymization steps
```

## 📦 Installation

### Prerequisites
- Python 3.8+
- pip (installed via get-pip.py if needed)

### Setup

```bash
# Navigate to service directory
cd ai-anonymization-service

# Install dependencies
pip install -r requirements.txt

# Download spaCy language model
python -m spacy download en_core_web_sm
```

### Dependencies
- **FastAPI**: Modern web framework for building APIs
- **uvicorn**: ASGI server for FastAPI
- **transformers**: Hugging Face library for BioBERT
- **spacy**: NLP library for Med7 model
- **pandas**: Data manipulation for k-anonymity
- **numpy**: Numerical operations
- **scikit-learn**: Machine learning utilities
- **pdfplumber**: PDF text extraction

## 🚀 Running the Service

### Development Mode
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

The service will be available at `http://localhost:8000`

## 🔌 API Endpoints

### Health Check
**GET** `/health`

Check if the service is running.

**Response:**
```json
{
  "status": "healthy",
  "service": "AI Anonymization Service"
}
```

### Anonymize Data
**POST** `/api/anonymize`

Anonymize medical data using specified techniques.

**Request Body:**
```json
{
  "fileUrl": "path/to/medical/file.pdf",
  "anonymizationType": "ner|k-anonymity|differential-privacy|full",
  "privacyLevel": "low|medium|high"
}
```

**Parameters:**
- `fileUrl` (string, required): Path to the medical file to anonymize
- `anonymizationType` (string, required): 
  - `ner`: Named Entity Recognition only
  - `k-anonymity`: K-anonymity generalization
  - `differential-privacy`: Differential privacy noise
  - `full`: All techniques combined (recommended)
- `privacyLevel` (string, required):
  - `low`: k=3, epsilon=1.0
  - `medium`: k=5, epsilon=0.5
  - `high`: k=10, epsilon=0.1

**Response:**
```json
{
  "anonymizedFileUrl": "path/to/anonymized/file.pdf",
  "entitiesRedacted": ["PATIENT_NAME", "SSN", "DATE_OF_BIRTH"],
  "privacyMetrics": {
    "kValue": 5,
    "epsilonValue": 0.1
  },
  "originalHash": "sha256_hash_of_original",
  "anonymizedHash": "sha256_hash_of_anonymized"
}
```

## 🧪 Testing

### Manual Testing with curl
```bash
# Health check
curl http://localhost:8000/health

# Anonymize a sample file
curl -X POST http://localhost:8000/api/anonymize \
  -H "Content-Type: application/json" \
  -d '{
    "fileUrl": "sample_medical_record.pdf",
    "anonymizationType": "full",
    "privacyLevel": "high"
  }'
```

### Python Testing
```python
import requests

# Health check
response = requests.get("http://localhost:8000/health")
print(response.json())

# Anonymize data
response = requests.post(
    "http://localhost:8000/api/anonymize",
    json={
        "fileUrl": "sample_medical_record.pdf",
        "anonymizationType": "full",
        "privacyLevel": "high"
    }
)
print(response.json())
```

## 🔐 Privacy Techniques Explained

### Named Entity Recognition (NER)
Uses BioBERT and Med7 to identify and redact:
- Patient names
- Social Security Numbers (SSN)
- Medical Record Numbers (MRN)
- Dates of birth
- Addresses
- Phone numbers
- Email addresses

### K-Anonymity
Ensures each record is indistinguishable from at least k-1 other records by:
- **Generalization**: Converting specific values to ranges (e.g., age 42 → 40-50)
- **Suppression**: Removing direct identifiers that can't be generalized

### Differential Privacy
Adds calibrated Laplace noise to numerical data to provide mathematical privacy guarantees:
- Privacy budget (epsilon): Controls noise magnitude
- Lower epsilon = stronger privacy but less utility
- Higher epsilon = less privacy but better data quality

## 🔧 Configuration

Environment variables (optional):
```bash
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# Model Configuration
BIOBERT_MODEL=dmis-lab/biobert-base-cased-v1.1
SPACY_MODEL=en_core_web_sm

# Privacy Settings (defaults)
DEFAULT_K_VALUE=5
DEFAULT_EPSILON=0.5
```

## 🐛 Troubleshooting

### Common Issues

1. **"No module named pip"**
   ```bash
   python get-pip.py
   ```

2. **spaCy model not found**
   ```bash
   python -m spacy download en_core_web_sm
   ```

3. **BioBERT download fails**
   - Check internet connection
   - Try manually downloading from Hugging Face

4. **Out of memory errors**
   - Reduce batch size in pipeline.py
   - Use smaller models
   - Increase system RAM

## 🔗 Integration with Backend

The backend Express.js service should call this API during file upload:

```javascript
const axios = require('axios');

async function anonymizeFile(filePath, privacyLevel = 'high') {
  try {
    const response = await axios.post(
      'http://localhost:8000/api/anonymize',
      {
        fileUrl: filePath,
        anonymizationType: 'full',
        privacyLevel: privacyLevel
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Anonymization failed:', error);
    throw error;
  }
}
```

## 📊 Performance

- **Startup Time**: ~5-10 seconds (model loading)
- **Processing Speed**: ~2-5 seconds per document (depends on size)
- **Memory Usage**: ~2-4 GB (BioBERT model in memory)
- **Concurrent Requests**: Supports multiple workers with uvicorn

## 🛣️ Roadmap

- [ ] Add support for DICOM medical images
- [ ] Implement federated learning anonymization
- [ ] Add batch processing for multiple files
- [ ] Create Docker container for easy deployment
- [ ] Add comprehensive unit and integration tests
- [ ] Implement caching for frequently anonymized patterns
- [ ] Add support for HL7 FHIR data formats

## 📄 License

Part of the AidChain project - See main repository for license information.

## 🤝 Contributing

Contributions welcome! Please see main repository CONTRIBUTING.md for guidelines.

## 📞 Support

For issues specific to the AI service:
1. Check this README first
2. Review error logs
3. Open an issue in the main AidChain repository with the `ai-service` label
