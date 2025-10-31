"""
Schémas Pydantic pour les réponses API
"""
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime


class DetectedEntity(BaseModel):
    """Entité détectée par l'IA"""
    text: str = Field(..., description="Texte de l'entité détectée")
    type: str = Field(..., description="Type d'entité (PERSON, EMAIL, etc.)")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confiance du modèle")
    source: str = Field(..., description="Modèle source (ClinicalBERT, XLM-RoBERTa, etc.)")
    row_index: Optional[int] = Field(None, description="Index de la ligne source")


class ColumnInfo(BaseModel):
    """Information sur une colonne analysée"""
    column_name: str = Field(..., description="Nom de la colonne")
    is_sensitive: bool = Field(..., description="Est-ce que la colonne est sensible ?")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confiance de détection")
    entity_types: List[str] = Field(default_factory=list, description="Types d'entités détectées")
    reasoning: str = Field(..., description="Raison de la classification")
    
    # Exemples AVANT anonymisation
    sample_before: List[str] = Field(
        default_factory=list,
        max_items=5,
        description="Exemples de valeurs AVANT anonymisation"
    )
    
    # Exemples APRÈS anonymisation
    sample_after: List[str] = Field(
        default_factory=list,
        max_items=5,
        description="Exemples de valeurs APRÈS anonymisation"
    )
    
    # Entités détectées (avec traçabilité)
    detected_entities: List[DetectedEntity] = Field(
        default_factory=list,
        description="Entités détectées par l'IA avec traçabilité"
    )


class DetectionSummary(BaseModel):
    """Résumé de la détection"""
    total_columns: int = Field(..., description="Nombre total de colonnes")
    sensitive_columns: int = Field(..., description="Nombre de colonnes sensibles")
    public_columns: int = Field(..., description="Nombre de colonnes publiques")
    file_format: str = Field(..., description="Format du fichier source")
    rows: int = Field(..., description="Nombre de lignes")
    columns: int = Field(..., description="Nombre de colonnes")


class AnonymizationResponse(BaseModel):
    """Réponse complète de l'API"""
    success: bool = Field(..., description="Statut de l'opération")
    message: str = Field(..., description="Message descriptif")
    
    # Métadonnées fichier
    original_filename: str = Field(..., description="Nom du fichier original")
    anonymized_filename: str = Field(..., description="Nom du fichier anonymisé")
    download_url: str = Field(..., description="URL de téléchargement")
    
    # Résumé détection
    summary: DetectionSummary
    
    # Détails colonnes sensibles
    sensitive_columns: List[ColumnInfo] = Field(
        default_factory=list,
        description="Détails des colonnes sensibles avec exemples avant/après"
    )
    
    # Timestamps
    processed_at: datetime = Field(
        default_factory=datetime.now,
        description="Date/heure de traitement"
    )
    
    # Stats performance
    processing_time_seconds: Optional[float] = Field(
        None,
        description="Temps de traitement en secondes"
    )


class HealthCheckResponse(BaseModel):
    """Réponse du health check"""
    status: str = Field(..., description="Statut de l'API")
    version: str = Field(..., description="Version de l'API")
    models_loaded: bool = Field(..., description="Modèles IA chargés ?")
    uptime_seconds: float = Field(..., description="Temps depuis démarrage (secondes)")
    

class ErrorResponse(BaseModel):
    """Réponse en cas d'erreur"""
    success: bool = Field(False, description="Statut (toujours False)")
    error: str = Field(..., description="Type d'erreur")
    message: str = Field(..., description="Message d'erreur détaillé")
    detail: Optional[Dict[str, Any]] = Field(
        None,
        description="Détails supplémentaires"
    )