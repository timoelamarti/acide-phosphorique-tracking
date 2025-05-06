# backend/app/routes/acid_routes.py
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Optional
from ..models.acid import ProcessState, SimulationParams, SimulationResult, Alert
from ..services.acid_service import AcidService
from datetime import datetime, timedelta

router = APIRouter(
    prefix="/api/acid",
    tags=["acid"],
    responses={404: {"description": "Not found"}},
)

# Pour le moment, utilisons des données en mémoire comme "base de données"
current_state = None
simulation_results = []
alerts = []

@router.get("/state", response_model=ProcessState)
async def get_current_state():
    """Récupère l'état actuel du processus"""
    if not current_state:
        raise HTTPException(status_code=404, detail="État non disponible")
    return current_state

@router.post("/state", response_model=ProcessState)
async def update_state(state: ProcessState):
    """Met à jour l'état actuel du processus"""
    global current_state
    current_state = state
    return current_state

@router.post("/simulate", response_model=SimulationResult)
async def run_simulation(params: SimulationParams):
    """Exécute une simulation avec les paramètres donnés"""
    result = AcidService.run_simulation(params)
    simulation_results.append(result)
    return result

@router.get("/simulations", response_model=List[SimulationResult])
async def get_simulations():
    """Récupère toutes les simulations enregistrées"""
    return simulation_results

@router.get("/simulations/{simulation_id}", response_model=SimulationResult)
async def get_simulation(simulation_id: int):
    """Récupère une simulation spécifique par ID"""
    if simulation_id < 0 or simulation_id >= len(simulation_results):
        raise HTTPException(status_code=404, detail="Simulation non trouvée")
    return simulation_results[simulation_id]

@router.post("/alerts", response_model=Alert)
async def create_alert(alert: Alert):
    """Crée une nouvelle alerte"""
    alerts.append(alert)
    return alert

@router.get("/alerts", response_model=List[Alert])
async def get_alerts(severity: Optional[str] = None, category: Optional[str] = None):
    """Récupère toutes les alertes, filtrées par sévérité et/ou catégorie"""
    filtered_alerts = alerts
    
    if severity:
        filtered_alerts = [a for a in filtered_alerts if a.severity == severity.upper()]
    
    if category:
        filtered_alerts = [a for a in filtered_alerts if a.category == category.upper()]
    
    return filtered_alerts