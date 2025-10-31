from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import shutil
import traceback
import time
import json

from models.pipeline import AidChainPipeline
from schemas.response import AnonymizationResponse, DetectionSummary, ColumnInfo, DetectedEntity

router = APIRouter()

# Dossier uploads
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Pipeline singleton
pipeline = AidChainPipeline()


@router.post(
    "/api/anonymize",
    response_model=AnonymizationResponse,
    summary="Anonymiser un fichier",
    description="Anonymise un fichier (CSV, Excel, PDF, JSON, TXT) et retourne 5 premières lignes"
)
async def anonymize_file(file: UploadFile = File(...)):
    """
    ✅ RETOURNE 5 PREMIÈRES LIGNES ANONYMISÉES
    """
    start_time = time.time()
    
    # 1. Validation extension
    allowed_extensions = {'.csv', '.xlsx', '.xls', '.json', '.txt', '.pdf'}
    file_ext = Path(file.filename).suffix.lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(400, f"Format {file_ext} non supporté. Formats acceptés: {allowed_extensions}")
    
    # 2. Sauvegarde temporaire
    temp_path = UPLOAD_DIR / file.filename
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 3. Pipeline complet
        result = pipeline.process(str(temp_path))
        
        # 4. Extraction données
        detection = result['detection']
        output_filename = Path(result['output_path']).name
        
        # 5. Construction colonnes sensibles avec EXEMPLES
        sensitive_columns = []
        
        for col_name, col_info in detection['columns'].items():
            if not col_info['is_sensitive']:
                continue
            
            # Récupérer exemples AVANT (depuis détection)
            sample_before = col_info['sample_values'][:5]
            
            # Récupérer exemples APRÈS (depuis DataFrame anonymisé)
            df_anon = result['anonymized_df']
            sample_after = df_anon[col_name].dropna().head(5).astype(str).tolist()
            
            # Entités détectées
            detected_entities = [
                DetectedEntity(**entity) 
                for entity in col_info['detected_entities'][:10]  # Limiter à 10
            ]
            
            sensitive_columns.append(
                ColumnInfo(
                    column_name=col_name,
                    is_sensitive=True,
                    confidence=col_info['confidence'],
                    entity_types=col_info['entity_types'],
                    reasoning=col_info['reasoning'],
                    sample_before=sample_before,
                    sample_after=sample_after,
                    detected_entities=detected_entities
                )
            )
        
        # 6. Résumé
        summary = DetectionSummary(
            total_columns=detection['summary']['total'],
            sensitive_columns=detection['summary']['sensitive'],
            public_columns=detection['summary']['public'],
            file_format=detection['format'],
            rows=detection['shape'][0],
            columns=detection['shape'][1]
        )
        
        # 7. Temps de traitement
        processing_time = time.time() - start_time
        
        # 8. URL de téléchargement
        download_url = f"/api/download/{output_filename}"
        
        return AnonymizationResponse(
            success=True,
            message=f"✅ Fichier anonymisé avec succès ({processing_time:.2f}s)",
            original_filename=file.filename,
            anonymized_filename=output_filename,
            download_url=download_url,
            summary=summary,
            sensitive_columns=sensitive_columns,
            processing_time_seconds=round(processing_time, 2)
        )
    
    except Exception as e:
        print(f"\n❌ ERREUR: {e}")
        traceback.print_exc()
        raise HTTPException(500, f"❌ Erreur : {str(e)}")
    
    finally:
        # Nettoyage
        if temp_path.exists():
            temp_path.unlink()


@router.get("/api/download/{filename}")
async def download_file(filename: str):
    """Télécharge un fichier anonymisé"""
    from fastapi.responses import FileResponse
    
    file_path = Path("anonymized") / filename
    
    if not file_path.exists():
        raise HTTPException(404, f"Fichier '{filename}' introuvable")
    
    return FileResponse(
        path=str(file_path),
        filename=filename,
        media_type='application/octet-stream'
    )