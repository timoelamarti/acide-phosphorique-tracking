# backend/app/models/acid.py
from pydantic import BaseModel
from typing import Optional, List, Dict, Union
from datetime import datetime

class AcidReading(BaseModel):
    """Représente une lecture de capteur d'acide"""
    timestamp: datetime
    source: str  # 'FILTRE_A', 'FILTRE_B', etc.
    value: float  # Valeur mesurée
    unit: str  # Unité (m³/h, etc.)

class AcidStock(BaseModel):
    """Représente l'état du stock d'acide"""
    acid_type: str  # 'ACP_28', 'ACP_54'
    current_volume: float
    max_capacity: float
    time_until_empty: Optional[Union[float, str]]  # En heures ou "aucun"
    readings: List[Dict[str, float]]  # Historique des lectures

class FlowRate(BaseModel):
    """Représente un débit d'acide (entrée ou sortie)"""
    label: str  # 'Filtre A', 'Echelon J', etc.
    value: float
    unit: str = "m³/h"

class ProcessState(BaseModel):
    """État complet du processus"""
    timestamp: datetime
    acid_28_production: List[FlowRate]
    acid_28_consumption: List[FlowRate]
    acid_28_stock: AcidStock
    acid_54_production: List[FlowRate]
    acid_54_consumption: List[FlowRate]
    acid_54_stock: AcidStock

class SimulationParams(BaseModel):
    """Paramètres pour une simulation"""
    duration_hours: float = 24.0
    filtre_a_rate: float
    filtre_b_rate: float
    additional_input_rate: float = 0.0
    echelon_j_rate: float
    echelon_k_rate: float
    echelon_l_rate: float
    dap1_consumption_rate: float
    dap2_consumption_rate: float
    cap_transfer_rate: float
    initial_acid_28_stock: float
    initial_acid_54_stock: float
    max_acid_28_capacity: float
    max_acid_54_capacity: float

class SimulationResult(BaseModel):
    """Résultats d'une simulation"""
    name: str
    created_at: datetime
    params: SimulationParams
    timeline: List[ProcessState]
    alerts: List[Dict]

class Alert(BaseModel):
    """Alerte système"""
    timestamp: datetime
    severity: str  # "INFO", "WARNING", "CRITICAL"
    category: str  # "STOCK", "PRODUCTION", "QUALITY", etc.
    message: str
    source: str
    details: Optional[Dict] = None
    acknowledged: bool = False

# Ajoutons aussi un modèle pour l'utilisateur
class User(BaseModel):
    id: Optional[int] = None
    username: str
    email: str
    role: str
    is_active: bool = True
    created_at: Optional[datetime] = None
    preferences: Optional[dict] = None