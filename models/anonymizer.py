import warnings
warnings.filterwarnings('ignore')

import hashlib
import random
from datetime import datetime, timedelta
from typing import Dict, List, Any
import pandas as pd
from faker import Faker


class UltraProAnonymizer:
    """
    🎭 ANONYMISEUR INTELLIGENT - VERSION CORRIGÉE
    """
    
    _instance = None
    _mapping_cache = {}
    
    def __new__(cls, locale='fr_FR'):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self, locale='fr_FR'):
        if hasattr(self, '_initialized'):
            return
        
        self.fake = Faker(locale)
        self.mapping_cache = self._mapping_cache
        Faker.seed(42)
        random.seed(42)
        self._initialized = True
    
    def anonymize_dataframe(self, df: pd.DataFrame, detection_results: Dict) -> pd.DataFrame:
        """Anonymise DataFrame complet"""
        df_anon = df.copy()
        
        for col_name, col_info in detection_results['columns'].items():
            if not col_info['is_sensitive']:
                continue
            
            entity_types = col_info['entity_types']
            detected_entities = col_info['detected_entities']
            
            df_anon[col_name] = self.anonymize_column(
                df_anon, col_name, entity_types, detected_entities
            )
        
        return df_anon
    
    def anonymize_column(self, df: pd.DataFrame, col_name: str, 
                        entity_types: List[str], detected_entities: List[Dict]) -> pd.Series:
        """Anonymisation intelligente"""
        col_data = df[col_name].copy()
        
        # 🔒 CRITIQUE: Éviter sur-anonymisation
        # Si déjà des codes MED_, ne pas réanonymiser
        if col_data.astype(str).str.contains('MED_', regex=False).any():
            return col_data
        
        # Dates (décalage temporel)
        if 'DATE' in entity_types:
            col_data = self._anonymize_dates(col_data, detected_entities)
        
        # IDs (hash unique)
        elif 'IDENTIFIER' in entity_types:
            col_data = self._anonymize_identifiers(col_data)
        
        # Personnes (Faker noms)
        elif 'PERSON' in entity_types:
            col_data = self._anonymize_persons(col_data, detected_entities)
        
        # Lieux (Faker villes)
        elif 'LOCATION' in entity_types:
            col_data = self._anonymize_locations(col_data, detected_entities)
        
        # Emails
        elif 'EMAIL' in entity_types:
            col_data = self._anonymize_emails(col_data, detected_entities)
        
        # Phones
        elif 'PHONE' in entity_types:
            col_data = self._anonymize_phones(col_data, detected_entities)
        
        # Organisations
        elif 'ORGANIZATION' in entity_types:
            col_data = self._anonymize_organizations(col_data, detected_entities)
        
        # Médical (codes génériques)
        else:
            medical_types = [t for t in entity_types if t not in 
                            ['PERSON', 'LOCATION', 'ORGANIZATION', 'DATE', 'IDENTIFIER', 'EMAIL', 'PHONE']]
            if medical_types:
                col_data = self._anonymize_medical(col_data, detected_entities, medical_types)
        
        return col_data
    
    def _anonymize_persons(self, col_data: pd.Series, entities: List[Dict]) -> pd.Series:
        """Remplace noms par Faker"""
        def replace_name(val):
            if pd.isna(val):
                return val
            
            str_val = str(val)
            
            # Ne pas toucher aux codes MED_
            if 'MED_' in str_val:
                return val
            
            # Cache pour cohérence
            if str_val not in self.mapping_cache:
                self.mapping_cache[str_val] = self.fake.name()
            
            return self.mapping_cache[str_val]
        
        return col_data.apply(replace_name)
    
    def _anonymize_locations(self, col_data: pd.Series, entities: List[Dict]) -> pd.Series:
        """Remplace lieux par Faker"""
        def replace_location(val):
            if pd.isna(val):
                return val
            
            str_val = str(val)
            
            if 'MED_' in str_val:
                return val
            
            if str_val not in self.mapping_cache:
                self.mapping_cache[str_val] = self.fake.city()
            
            return self.mapping_cache[str_val]
        
        return col_data.apply(replace_location)
    
    def _anonymize_organizations(self, col_data: pd.Series, entities: List[Dict]) -> pd.Series:
        """Remplace organisations"""
        def replace_org(val):
            if pd.isna(val):
                return val
            
            str_val = str(val)
            
            if 'MED_' in str_val:
                return val
            
            if str_val not in self.mapping_cache:
                self.mapping_cache[str_val] = self.fake.company()
            
            return self.mapping_cache[str_val]
        
        return col_data.apply(replace_org)
    
    def _anonymize_dates(self, col_data: pd.Series, entities: List[Dict]) -> pd.Series:
        """Décale dates de manière cohérente"""
        if 'date_offset' not in self.mapping_cache:
            self.mapping_cache['date_offset'] = random.randint(-365, 365)
        
        offset = self.mapping_cache['date_offset']
        
        def shift_date(val):
            if pd.isna(val):
                return val
            
            try:
                if isinstance(val, (datetime, pd.Timestamp)):
                    return val + timedelta(days=offset)
                
                parsed = pd.to_datetime(val, errors='coerce')
                if pd.notna(parsed):
                    return parsed + timedelta(days=offset)
                
                return val
            except:
                return val
        
        return col_data.apply(shift_date)
    
    def _anonymize_emails(self, col_data: pd.Series, entities: List[Dict]) -> pd.Series:
        """Remplace emails"""
        def replace_email(val):
            if pd.isna(val):
                return val
            
            str_val = str(val)
            
            if 'MED_' in str_val or '@' not in str_val:
                return val
            
            if str_val not in self.mapping_cache:
                self.mapping_cache[str_val] = self.fake.email()
            
            return self.mapping_cache[str_val]
        
        return col_data.apply(replace_email)
    
    def _anonymize_phones(self, col_data: pd.Series, entities: List[Dict]) -> pd.Series:
        """Remplace téléphones"""
        def replace_phone(val):
            if pd.isna(val):
                return val
            
            str_val = str(val)
            
            if 'MED_' in str_val:
                return val
            
            # Détection pattern téléphone
            digit_ratio = sum(c.isdigit() for c in str_val) / max(len(str_val), 1)
            
            if digit_ratio < 0.5:
                return val
            
            if str_val not in self.mapping_cache:
                self.mapping_cache[str_val] = self.fake.phone_number()
            
            return self.mapping_cache[str_val]
        
        return col_data.apply(replace_phone)
    
    def _anonymize_identifiers(self, col_data: pd.Series) -> pd.Series:
        """Hash identifiants uniques"""
        def hash_id(val):
            if pd.isna(val):
                return val
            
            str_val = str(val)
            
            if 'MED_' in str_val or 'ID_' in str_val:
                return val
            
            if str_val not in self.mapping_cache:
                hashed = hashlib.sha256(str_val.encode()).hexdigest()[:8]
                self.mapping_cache[str_val] = f"ID_{hashed.upper()}"
            
            return self.mapping_cache[str_val]
        
        return col_data.apply(hash_id)
    
    def _anonymize_medical(self, col_data: pd.Series, entities: List[Dict], medical_types: List[str]) -> pd.Series:
     result = col_data.copy()
    
     medical_entities = [e for e in entities if e['type'] in medical_types]
    
     # ✅ FILTRE ANTI-OVER-ANONYMISATION
     filtered_entities = []
    
     for ent in medical_entities:
        text = ent['text']
        
        # Ignorer si :
        # 1. Trop court (<3 caractères)
        if len(text) < 3:
            continue
        
        # 2. Mot générique anglais
        generic_words = {'the', 'and', 'for', 'with', 'from', 'this', 'that', 'are', 'was', 'were'}
        if text.lower() in generic_words:
            continue
        
        # 3. Ponctuation seule
        if not any(c.isalnum() for c in text):
            continue
        
        # 4. Confiance trop faible (<40%)
        if ent['confidence'] < 0.4:
            continue
        
        filtered_entities.append(ent)
    
     # Anonymisation uniquement sur entités filtrées
     for ent in filtered_entities:
        original = ent['text']
        
        if original not in self.mapping_cache:
            hashed = abs(hash(original)) % 10000
            self.mapping_cache[original] = f"MED_{hashed:04d}"
        
        fake_term = self.mapping_cache[original]
        
        result = result.apply(
            lambda x: str(x).replace(original, fake_term) if pd.notna(x) and original in str(x) else x
        )
    