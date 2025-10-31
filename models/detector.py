import warnings
warnings.filterwarnings('ignore')

import re
from typing import Dict, List, Tuple
from dataclasses import dataclass

import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

try:
    import torch
    from transformers import pipeline as hf_pipeline
    USE_TRANSFORMERS = True
except:
    import spacy
    USE_TRANSFORMERS = False


@dataclass
class DetectionResult:
    is_sensitive: bool
    confidence: float
    entity_types: List[str]
    reasoning: str
    sample_values: List[str]
    detected_entities: List[Dict]


class UltraProDetector:
    
    _instance = None
    _models_loaded = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._models_loaded:
            return
        
        print("\n" + "="*70)
        print("🚀 ULTRA-PRO DETECTOR")
        print("="*70 + "\n")
        
        if USE_TRANSFORMERS:
            self._init_transformers()
        else:
            self._init_spacy()
        
        self.anomaly_detector = IsolationForest(
            contamination=0.1,
            random_state=42,
            n_estimators=100
        )
        self.scaler = StandardScaler()
        
        print("✅ Système 100% IA prêt!\n" + "="*70 + "\n")
        self._models_loaded = True
    
    def _init_transformers(self):
        """Init avec transformers"""
        print("🔥 Mode: Transformers (ClinicalBERT + XLM-RoBERTa)")
        
        device = 0 if torch.cuda.is_available() else -1
        print(f"🖥️ Device: {'GPU' if device >= 0 else 'CPU'}\n")
        
        # NER médical
        medical_models = [
            "dmis-lab/biobert-base-cased-v1.2",
            "emilyalsentzer/Bio_ClinicalBERT"
        ]
        
        for model in medical_models:
            try:
                self.ner_medical = hf_pipeline(
                    "ner",
                    model=model,
                    aggregation_strategy="simple",
                    device=device
                )
                print(f"✅ {model}")
                break
            except:
                continue
        
        # NER multilingue
        multilingual_models = [
            "Davlan/xlm-roberta-base-finetuned-conll03-multilingual",
            "xlm-roberta-large-finetuned-conll03-english"
        ]
        
        for model in multilingual_models:
            try:
                self.ner_general = hf_pipeline(
                    "ner",
                    model=model,
                    aggregation_strategy="simple",
                    device=device
                )
                print(f"✅ {model}\n")
                break
            except:
                continue
    
    def _init_spacy(self):
        """Init avec spaCy (fallback)"""
        print("🔥 Mode: spaCy (fallback)\n")
        
        for model in ["en_core_web_sm", "en_core_web_md"]:
            try:
                self.nlp_en = spacy.load(model)
                print(f"✅ {model} (EN)")
                break
            except:
                continue
        
        for model in ["fr_core_news_sm", "fr_core_news_md"]:
            try:
                self.nlp_fr = spacy.load(model)
                print(f"✅ {model} (FR)\n")
                break
            except:
                self.nlp_fr = None
                continue
    
    def analyze_column(self, df: pd.DataFrame, col_name: str) -> DetectionResult:
        """Analyse d'une colonne"""
        print(f"🔍 {col_name:<30}", end=" ")
        
        col_data = df[col_name].dropna()
        if len(col_data) == 0:
            print("⚠️ Vide")
            return DetectionResult(False, 0.0, [], "Vide", [], [])
        
        sample = col_data.sample(n=min(200, len(col_data)), random_state=42)
        sample_str = sample.astype(str)
        
        # NER
        entities, detected_ents = self._extract_entities(sample_str, col_data.index)
        
        # Contacts
        contact_info = self._detect_contact_identifiers(sample_str)
        
        # Unicité
        uniqueness = len(col_data.unique()) / len(col_data)
        
        # Décision
        result = self._decide(entities, contact_info, uniqueness, sample_str, detected_ents)
        
        icon = "🔒" if result.is_sensitive else "✅"
        status = "SENSIBLE" if result.is_sensitive else "PUBLIC"
        print(f"→ {icon} {status} ({result.confidence:.0%})")
        
        return result
    
    def _extract_entities(self, sample: pd.Series, indices) -> Tuple[Dict[str, int], List[Dict]]:
        """Extraction entités NER"""
        entity_counts = {}
        detected_entities = []
        
        for idx, text in zip(indices[:30], sample.head(30)):
            text_str = str(text)[:500]
            
            if len(text_str.strip()) < 3:
                continue
            
            try:
                if USE_TRANSFORMERS:
                    # NER médical
                    try:
                        ents = self.ner_medical(text_str)
                        for e in ents:
                            label = e['entity_group'].upper()
                            entity_counts[label] = entity_counts.get(label, 0) + 1
                            detected_entities.append({
                                'text': e['word'],
                                'type': label,
                                'confidence': float(e['score']),
                                'source': 'ClinicalBERT',
                                'row_index': int(idx)
                            })
                    except:
                        pass
                    
                    # NER général
                    try:
                        ents = self.ner_general(text_str)
                        for e in ents:
                            label = self._normalize_label(e['entity_group'])
                            entity_counts[label] = entity_counts.get(label, 0) + 1
                            detected_entities.append({
                                'text': e['word'],
                                'type': label,
                                'confidence': float(e['score']),
                                'source': 'XLM-RoBERTa',
                                'row_index': int(idx)
                            })
                    except:
                        pass
                
                else:
                    # spaCy
                    nlp = self.nlp_fr if hasattr(self, 'nlp_fr') and self.nlp_fr else self.nlp_en
                    doc = nlp(text_str)
                    
                    for ent in doc.ents:
                        label = self._normalize_label(ent.label_)
                        entity_counts[label] = entity_counts.get(label, 0) + 1
                        detected_entities.append({
                            'text': ent.text,
                            'type': label,
                            'confidence': 1.0,
                            'source': 'spaCy',
                            'row_index': int(idx)
                        })
            
            except:
                continue
        
        return entity_counts, detected_entities
    
    def _normalize_label(self, label: str) -> str:
        """Normalisation labels"""
        label = label.upper()
        
        if label in ['PER', 'PERSON', 'PERS']:
            return 'PERSON'
        elif label in ['LOC', 'GPE', 'LOCATION']:
            return 'LOCATION'
        elif label in ['ORG', 'ORGANIZATION']:
            return 'ORGANIZATION'
        elif label in ['DATE', 'TIME']:
            return 'DATE'
        else:
            return label
    
    def _detect_contact_identifiers(self, sample: pd.Series) -> Dict:
        """Détection emails/phones/IDs"""
        result = {
            'has_email': False,
            'has_phone': False,
            'has_id': False,
            'email_count': 0,
            'phone_count': 0,
            'id_ratio': 0.0
        }
        
        email_count = 0
        phone_count = 0
        
        for value in sample:
            text = str(value)
            
            # Email
            if '@' in text and '.' in text:
                parts = text.split('@')
                if len(parts) == 2 and '.' in parts[1]:
                    email_count += 1
            
            # Phone
            digit_ratio = sum(c.isdigit() for c in text) / max(len(text), 1)
            if (digit_ratio > 0.6 and len(text) >= 8) or (text.startswith('+') and digit_ratio > 0.5):
                phone_count += 1
        
        result['email_count'] = email_count
        result['phone_count'] = phone_count
        result['has_email'] = email_count > 0
        result['has_phone'] = phone_count > 0
        
        # IDs via Isolation Forest
        try:
            features = []
            
            for value in sample.head(100):
                text = str(value)
                
                feat = [
                    len(text),
                    sum(c.isdigit() for c in text),
                    sum(c.isalpha() for c in text),
                    sum(c.isupper() for c in text),
                    sum(c.islower() for c in text),
                    sum(not c.isalnum() and not c.isspace() for c in text),
                    text.count('-'),
                    text.count('_'),
                    text.count('.'),
                    text.count('@'),
                    int(text.isalnum()),
                    int(text.isdigit()),
                ]
                
                features.append(feat)
            
            if len(features) >= 10:
                X = np.array(features)
                X_scaled = self.scaler.fit_transform(X)
                predictions = self.anomaly_detector.fit_predict(X_scaled)
                
                result['id_ratio'] = (predictions == -1).sum() / len(predictions)
                result['has_id'] = result['id_ratio'] > 0.2
        
        except:
            pass
        
        return result
    
    def _decide(self, entities: Dict[str, int], contact_info: Dict,
                uniqueness: float, sample: pd.Series, detected_ents: List[Dict]) -> DetectionResult:
        """Décision finale"""
        score = 0.0
        types = []
        reasons = []
        
        sample_size = min(30, len(sample))
        
        # Personnes
        person_count = entities.get('PERSON', 0)
        if person_count > 0:
            ratio = person_count / sample_size
            score += ratio * 0.4
            types.append('PERSON')
            reasons.append(f"Noms ({ratio:.0%})")
        
        # Emails
        if contact_info['has_email']:
            email_ratio = contact_info['email_count'] / sample_size
            score += email_ratio * 0.45
            types.append('EMAIL')
            reasons.append(f"Emails ({email_ratio:.0%})")
            
            for idx, val in enumerate(sample.head(30)):
                if '@' in str(val):
                    detected_ents.append({
                        'text': str(val),
                        'type': 'EMAIL',
                        'confidence': 0.95,
                        'source': 'Pattern',
                        'row_index': idx
                    })
        
        # Phones
        if contact_info['has_phone']:
            phone_ratio = contact_info['phone_count'] / sample_size
            score += phone_ratio * 0.4
            types.append('PHONE')
            reasons.append(f"Téléphones ({phone_ratio:.0%})")
        
        # IDs
        if contact_info['has_id'] and uniqueness > 0.7:
            score += 0.35
            types.append('IDENTIFIER')
            reasons.append(f"IDs ({uniqueness:.0%})")
        
        # Lieux
        loc_count = entities.get('LOCATION', 0)
        if loc_count > 0 and uniqueness > 0.5:
            ratio = loc_count / sample_size
            score += ratio * 0.25
            types.append('LOCATION')
            reasons.append(f"Lieux ({ratio:.0%})")
        
        # Organisations
        org_count = entities.get('ORGANIZATION', 0)
        if org_count > 0:
            ratio = org_count / sample_size
            score += ratio * 0.15
            types.append('ORGANIZATION')
        
        # Dates
        date_count = entities.get('DATE', 0)
        if date_count > 0 and uniqueness > 0.8:
            ratio = date_count / sample_size
            score += ratio * 0.2
            types.append('DATE')
            reasons.append(f"Dates ({ratio:.0%})")
        
        # Médical
        medical_types = [k for k in entities.keys() if k not in ['PERSON', 'LOCATION', 'ORGANIZATION', 'DATE']]
        if medical_types:
            med_count = sum(entities[k] for k in medical_types)
            ratio = med_count / sample_size
            score += min(ratio, 0.3)
            types.extend(medical_types)
            reasons.append(f"Médical ({ratio:.0%})")
        
        confidence = min(score, 1.0)
        is_sensitive = confidence >= 0.50
        
        reasoning = " | ".join(reasons) if reasons else "Catégoriel"
        samples = sample.head(5).astype(str).tolist()
        
        return DetectionResult(is_sensitive, confidence, types, reasoning, samples, detected_ents)