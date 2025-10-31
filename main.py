
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routes.anonymize import router as anonymize_router
from schemas.response import HealthCheckResponse, ErrorResponse
from config import (
    API_TITLE,
    API_VERSION,
    API_DESCRIPTION,
    CORS_ORIGINS
)

# Timestamp de démarrage
startup_time = time.time()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Gestion du cycle de vie de l'application
    (Chargement des modèles au démarrage)
    """
    print("\n" + "="*80)
    print("🚀 DÉMARRAGE AIDCHAIN API")
    print("="*80)
    
    # Préchargement des modèles IA
    from models import UltraProDetector, UltraProAnonymizer
    
    print("\n📥 Chargement des modèles IA...")
    detector = UltraProDetector()  # Singleton, charge une seule fois
    anonymizer = UltraProAnonymizer()
    
    print("\n✅ Modèles chargés avec succès!")
    print("="*80 + "\n")
    
    yield  # L'application tourne ici
    
    print("\n" + "="*80)
    print("🛑 ARRÊT AIDCHAIN API")
    print("="*80 + "\n")


# 🏗️ CRÉATION APP FASTAPI
app = FastAPI(
    title=API_TITLE,
    version=API_VERSION,
    description=API_DESCRIPTION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)


# 🌐 CORS (pour communication avec Node.js backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 📊 MIDDLEWARE LOGGING
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log toutes les requêtes"""
    start_time = time.time()
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    
    print(
        f"{request.method} {request.url.path} "
        f"→ {response.status_code} "
        f"({process_time:.2f}s)"
    )
    
    return response


# ❌ GESTIONNAIRE D'ERREURS GLOBAL
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Capture toutes les erreurs non gérées"""
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="INTERNAL_SERVER_ERROR",
            message=str(exc),
            detail={"path": str(request.url)}
        ).dict()
    )


# 🛣️ INCLUSION DES ROUTES
app.include_router(anonymize_router)


# 🏥 HEALTH CHECK
@app.get(
    "/health",
    response_model=HealthCheckResponse,
    tags=["Health"],
    summary="Vérifier l'état de l'API"
)
async def health_check():
    """
    Vérifie si l'API est opérationnelle et si les modèles sont chargés
    """
    from models import UltraProDetector
    
    detector = UltraProDetector()
    models_loaded = detector._models_loaded
    
    uptime = time.time() - startup_time
    
    return HealthCheckResponse(
        status="healthy" if models_loaded else "degraded",
        version=API_VERSION,
        models_loaded=models_loaded,
        uptime_seconds=round(uptime, 2)
    )


# 🏠 ROOT
@app.get(
    "/",
    tags=["Root"],
    summary="Page d'accueil API"
)
async def root():
    """
    Page d'accueil de l'API
    """
    return {
        "message": "🏥 AidChain Anonymization API",
        "version": API_VERSION,
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "anonymize": "POST /api/anonymize",
            "download": "GET /api/download/{filename}"
        }
    }


# 🚀 LANCEMENT (pour développement)
if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload en dev
        log_level="info"
    )