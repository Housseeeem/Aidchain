# 🧠 AidChain – Secure AI-powered Medical Data Sharing on Hedera

> **AI + Blockchain for healthcare**  
> AidChain enables hospitals and researchers to securely share anonymized medical datasets with verifiable integrity and transparent access control through **Hedera Hashgraph**.

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

![AidChain Architecture](docs/architecture.png)

### Components:
| Component | Description |
|------------|--------------|
| **AI Anonymizer** | Detects PHI entities via NLP (BioBERT/Med7) and pseudonymizes them |
| **Storage Manager** | Encrypts & uploads datasets to MinIO/S3 |
| **Hedera Adapter** | Records hashes & issues access tokens on Hedera Testnet |
| **Access API** | Manages permissions, logs and data provenance |
| **Frontend** | Simple React interface for uploading, viewing transactions, and granting access |

---

## 🧩 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React + TypeScript + Tailwind |
| **Backend** | FastAPI (Python) |
| **Database** | PostgreSQL |
| **Storage** | MinIO (S3-compatible, encrypted) |
| **Blockchain** | Hedera HCS + HTS |
| **AI** | HuggingFace Transformers + spaCy med7 |
| **Infra** | Docker + Docker Compose |



---

## ⚙️ Quick Start

### 1️⃣ Clone & setup
#### git clone https://github.com/Housseeeem/AidChain.git
#### cd AidChain
#### cp .env.example .env
### 2️⃣ Run the stack
#### docker compose up --build
#### The backend (FastAPI) runs at http://localhost:8000
#### Frontend (React) runs at http://localhost:5173

## 🧠 Core Features
| Feature | Description |
|----------|--------------|
| 🧩 **Upload** | Hospitals upload raw datasets for anonymization |
| 🤖 **AI Anonymization** | Automatic PHI (Protected Health Information) detection & replacement |
| 🔗 **Blockchain Proof** | Dataset hash and metadata written on Hedera HCS (Consensus Service) |
| 🪙 **Tokenized Access** | Permission tokens issued and managed via Hedera HTS (Token Service) |
| 🔍 **Audit Log** | All access and modification actions publicly verifiable on the Hedera network |
| 💬 **Research Portal** | Researchers request and obtain dataset access using their verified Hedera ID |


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

## 🌐 Links

- 🏆 [Hedera Africa Hackathon](https://dorahacks.io/hackathon/hederahackafrica/)  
- 📘 [Hedera Developer Docs](https://docs.hedera.com/)
