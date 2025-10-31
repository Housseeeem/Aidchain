
import warnings
warnings.filterwarnings('ignore')

from pathlib import Path
from datetime import datetime
from typing import Dict, Tuple
import pandas as pd
import json

from .detector import UltraProDetector
from .anonymizer import UltraProAnonymizer


class FileLoader:
    """Chargeur universel de fichiers"""
    
    @staticmethod
    def load(file_path: str) -> Tuple[pd.DataFrame, str]:
        """Charge un fichier et retourne (DataFrame, format)"""
        path = Path(file_path)
        
        if not path.exists():
            raise FileNotFoundError(f"Fichier introuvable: {file_path}")
        
        ext = path.suffix.lower()
        
        loaders = {
            '.csv': FileLoader._csv,
            '.xlsx': FileLoader._excel,
            '.xls': FileLoader._excel,
            '.json': FileLoader._json,
            '.txt': FileLoader._txt,
            '.pdf': FileLoader._pdf,
        }
        
        if ext in loaders:
            df = loaders[ext](file_path)
            return df, ext
        
        raise ValueError(f"Format {ext} non supporté")
    
    @staticmethod
    def _csv(path: str) -> pd.DataFrame:
        for enc in ['utf-8', 'latin1', 'cp1252']:
            for sep in [',', ';', '\t']:
                try:
                    return pd.read_csv(path, sep=sep, encoding=enc)
                except:
                    continue
        raise ValueError("CSV non lisible")
    
    @staticmethod
    def _excel(path: str) -> pd.DataFrame:
        return pd.read_excel(path)
    
    @staticmethod
    def _json(path: str) -> pd.DataFrame:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return pd.DataFrame(data if isinstance(data, list) else [data])
    
    @staticmethod
    def _txt(path: str) -> pd.DataFrame:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        try:
            from io import StringIO
            return pd.read_csv(StringIO(content))
        except:
            pass
        
        try:
            data = json.loads(content)
            return pd.DataFrame(data if isinstance(data, list) else [data])
        except:
            pass
        
        lines = [l.strip() for l in content.split('\n') if l.strip()]
        return pd.DataFrame({'text': lines})
    
    @staticmethod
    def _pdf(path: str) -> pd.DataFrame:
        """Charge PDF en mode texte complet"""
        try:
            import pdfplumber
        except:
            raise ImportError("pip install pdfplumber requis")
        
        full_text = []
        
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                if text := page.extract_text():
                    full_text.append(text)
        
        combined_text = '\n'.join(full_text)
        return pd.DataFrame({'full_text': [combined_text]})


class AidChainPipeline:
    """
    Pipeline complet: Détection → Anonymisation → Export
    """
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if hasattr(self, '_initialized'):
            return
        
        self.detector = UltraProDetector()
        self.anonymizer = UltraProAnonymizer()
        self.loader = FileLoader()
        
        self.output_dir = Path("anonymized")
        self.output_dir.mkdir(exist_ok=True)
        
        self._initialized = True
    
    def process(self, file_path: str) -> Dict:
        """
        Pipeline complet
        
        Returns:
            {
                'detection': {...},
                'original_df': DataFrame,
                'anonymized_df': DataFrame,
                'output_path': str,
                'sensitive_columns': [...],  # ← CLÉ AJOUTÉE
                'update_example': str
            }
        """
        # 1. Chargement
        df_original, source_format = self.loader.load(file_path)
        
        # 2. Détection
        detection_results = self._detect(df_original, file_path, source_format)
        
        # 3. Anonymisation
        df_anonymized = self.anonymizer.anonymize_dataframe(df_original, detection_results)
        
        # 4. Export
        output_path = self._export(df_anonymized, file_path, source_format)
        
        # 5. Générer exemple de mise à jour (5 premières lignes)
        update_example = self._generate_update_example(df_anonymized)
        
        # 6. Extraire colonnes sensibles
        sensitive_columns = [
            col_name for col_name, col_info in detection_results['columns'].items()
            if col_info['is_sensitive']
        ]
        
        return {
            'detection': detection_results,
            'original_df': df_original,
            'anonymized_df': df_anonymized,
            'output_path': str(output_path),
            'sensitive_columns': sensitive_columns,  # ← CLÉ CRITIQUE
            'update_example': update_example
        }
    
    def _detect(self, df: pd.DataFrame, file_path: str, source_format: str) -> Dict:
        """Détection des colonnes sensibles"""
        
        detection_results = {
            'file': file_path,
            'format': source_format,
            'shape': list(df.shape),
            'columns': {},
            'summary': {'total': len(df.columns), 'sensitive': 0, 'public': 0}
        }
        
        for col in df.columns:
            det = self.detector.analyze_column(df, col)
            
            detection_results['columns'][col] = {
                'is_sensitive': det.is_sensitive,
                'confidence': float(det.confidence),
                'entity_types': det.entity_types,
                'reasoning': det.reasoning,
                'sample_values': det.sample_values,
                'detected_entities': det.detected_entities
            }
            
            if det.is_sensitive:
                detection_results['summary']['sensitive'] += 1
            else:
                detection_results['summary']['public'] += 1
        
        return detection_results
    
    def _export(self, df: pd.DataFrame, original_path: str, source_format: str) -> Path:
        """Export fichier anonymisé"""
        
        original_name = Path(original_path).stem
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # PDF → TXT
        if source_format == '.pdf':
            output_file = self.output_dir / f"{original_name}_anonymized_{timestamp}.txt"
            
            if 'full_text' in df.columns:
                anonymized_text = df['full_text'].iloc[0]
            else:
                anonymized_text = '\n'.join(df.astype(str).values.flatten())
            
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(anonymized_text)
        
        # CSV
        elif source_format == '.csv':
            output_file = self.output_dir / f"{original_name}_anonymized_{timestamp}.csv"
            df.to_csv(output_file, index=False, encoding='utf-8')
        
        # Excel
        elif source_format in ['.xlsx', '.xls']:
            output_file = self.output_dir / f"{original_name}_anonymized_{timestamp}.xlsx"
            df.to_excel(output_file, index=False)
        
        # JSON
        elif source_format == '.json':
            output_file = self.output_dir / f"{original_name}_anonymized_{timestamp}.json"
            df.to_json(output_file, orient='records', force_ascii=False, indent=2)
        
        # TXT
        elif source_format == '.txt':
            output_file = self.output_dir / f"{original_name}_anonymized_{timestamp}.txt"
            
            if 'text' in df.columns:
                with open(output_file, 'w', encoding='utf-8') as f:
                    f.write('\n'.join(df['text'].astype(str)))
            else:
                df.to_csv(output_file, index=False, encoding='utf-8')
        
        # Par défaut → CSV
        else:
            output_file = self.output_dir / f"{original_name}_anonymized_{timestamp}.csv"
            df.to_csv(output_file, index=False, encoding='utf-8')
        
        return output_file
    
    def _generate_update_example(self, df: pd.DataFrame) -> str:
        """
        Génère un exemple JSON des 5 premières lignes (format update backend)
        """
        sample = df.head(5)
        
        # Convertir en format attendu par le backend
        records = sample.to_dict('records')
        
        return json.dumps(records, ensure_ascii=False, indent=2)