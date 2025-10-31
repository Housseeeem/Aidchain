from pathlib import Path
import os

# ================== CHEMINS ==================
BASE_DIR = Path(__file__).parent
UPLOAD_DIR = BASE_DIR / "uploads"
ANONYMIZED_DIR = BASE_DIR / "anonymized"
TEMP_DIR = BASE_DIR / "temp"

# Créer les dossiers
for directory in [UPLOAD_DIR, ANONYMIZED_DIR, TEMP_DIR]:
    directory.mkdir(exist_ok=True)

# ================== LIMITES FICHIERS ==================
# AUGMENTÉ pour gros datasets (milliers de lignes, gros PDF)
MAX_FILE_SIZE_MB = 500  # 500 MB (vs 100 MB avant)
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

# Streaming pour fichiers > 100 MB
CHUNK_SIZE = 8192  # 8 KB chunks
ENABLE_STREAMING = True

# Extensions supportées
ALLOWED_EXTENSIONS = {
    '.csv', '.xlsx', '.xls',  # Tableurs
    '.pdf',                    # Documents
    '.txt', '.json',          # Texte
    '.docx', '.doc'           # Word
}

# ================== API INFO ==================
API_TITLE = "AidChain Anonymization API"
API_VERSION = "1.0.0"
API_DESCRIPTION = """
 **AidChain** - Plateforme de partage sécurisé de données de santé

"""

# ================== CORS ==================
# Pour communication avec backend Node.js
CORS_ORIGINS = [
    "http://localhost:3000",       # React dev
    "http://localhost:5173",       # Vite dev
    "http://127.0.0.1:3000",
    "http://localhost:8080",       # Vue.js
    "https://votre-domaine.com"    # Production
]

CORS_ALLOW_METHODS = ["*"]
CORS_ALLOW_HEADERS = ["*"]
CORS_ALLOW_CREDENTIALS = True

# ================== TRAITEMENT ==================
# Détection IA
DEFAULT_LOCALE = "fr_FR"  # Faker locale
DETECTION_CONFIDENCE_THRESHOLD = 0.30  # 30% confidence minimum

# Performance
MAX_WORKERS = 4  # Threads pour traitement parallèle
BATCH_SIZE = 1000  # Lignes traitées par batch (pour gros CSV)

# ================== CACHE & CLEANUP ==================
# Expiration fichiers uploadés/anonymisés
FILE_EXPIRATION_HOURS = 24

# Auto-cleanup
ENABLE_AUTO_CLEANUP = True
CLEANUP_INTERVAL_HOURS = 6  # Nettoyage toutes les 6h

# ================== LOGGING ==================
LOG_LEVEL = "INFO"
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
LOG_FILE = BASE_DIR / "logs" / "aidchain_api.log"

# Créer dossier logs
LOG_FILE.parent.mkdir(exist_ok=True)

# ================== SÉCURITÉ ==================
# Rate limiting (éviter abus)
RATE_LIMIT_REQUESTS = 100  # requêtes max
RATE_LIMIT_PERIOD = 3600   # par heure

# Validation stricte
VALIDATE_FILE_CONTENT = True  # Vérifier contenu réel vs extension

# ================== RESPONSES ==================
# Format réponses JSON
PRETTY_JSON = True
JSON_INDENT = 2

# Exemples inclus dans docs
INCLUDE_EXAMPLES = True