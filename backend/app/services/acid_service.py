# backend/app/services/acid_service.py
from datetime import datetime, timedelta
from ..models.acid import ProcessState, AcidStock, FlowRate, SimulationParams, SimulationResult, Alert
from typing import List, Dict, Optional, Union
import numpy as np

class AcidService:
    """Service qui gère les calculs liés aux acides phosphoriques"""
    
    @staticmethod
    def calculate_stock(
        current_stock: float,
        inputs: List[float],
        outputs: List[float],
        duration_hours: float
    ) -> float:
        """Calcule le stock après une période donnée"""
        total_input = sum(inputs)
        total_output = sum(outputs)
        net_flow = total_input - total_output
        new_stock = current_stock + (net_flow * duration_hours)
        return max(0, new_stock)  # Le stock ne peut pas être négatif
    
    @staticmethod
    def calculate_time_until_empty(
        current_stock: float,
        inputs: List[float],
        outputs: List[float]
    ) -> Union[float, str]:
        """Calcule le temps jusqu'à épuisement du stock"""
        total_input = sum(inputs)
        total_output = sum(outputs)
        net_flow = total_input - total_output
        
        if net_flow >= 0:
            return "aucun"  # Le stock augmente ou reste stable
        
        time_until_empty = abs(current_stock / net_flow)
        return time_until_empty  # En heures
    
    @staticmethod
    def calculate_volume_produced(sensor_value: float) -> float:
        """Calcule le volume produit à partir de la valeur du capteur
        Formule: F2 = E6 * 10.1 * 176.625 / 100
        """
        return sensor_value * 10.1 * 176.625 / 100
    
    @staticmethod
    def run_simulation(params: SimulationParams) -> SimulationResult:
        """Exécute une simulation basée sur les paramètres fournis"""
        timeline = []
        alerts = []
        acid_28_stock = params.initial_acid_28_stock
        acid_54_stock = params.initial_acid_54_stock
        
        # Définir les entrées et sorties initiales
        acid_28_inputs = [params.filtre_a_rate, params.filtre_b_rate, params.additional_input_rate]
        acid_28_outputs = [
            params.echelon_j_rate, 
            params.echelon_k_rate, 
            params.echelon_l_rate,
            params.dap1_consumption_rate,
            params.dap2_consumption_rate,
            params.cap_transfer_rate
        ]
        
        # Pour l'acide 54%, l'entrée est le transfert du CAP, la sortie est à définir
        # Hypothèse: 90% de l'acide 28% transféré devient de l'acide 54%
        acid_54_production_rate = params.cap_transfer_rate * 0.9  # Hypothèse de rendement
        acid_54_inputs = [acid_54_production_rate]
        acid_54_outputs = [params.dap1_consumption_rate * 0.5, params.dap2_consumption_rate * 0.5]  # Hypothèse
        
        # Créer un point de données pour chaque heure de la simulation
        for hour in range(int(params.duration_hours) + 1):
            current_time = datetime.now() + timedelta(hours=hour)
            
            # Calculer les nouveaux stocks
            acid_28_stock = AcidService.calculate_stock(
                acid_28_stock, acid_28_inputs, acid_28_outputs, 1.0
            )
            
            acid_54_stock = AcidService.calculate_stock(
                acid_54_stock, acid_54_inputs, acid_54_outputs, 1.0
            )
            
            # Calculer le temps jusqu'à épuisement
            time_28_empty = AcidService.calculate_time_until_empty(
                acid_28_stock, acid_28_inputs, acid_28_outputs
            )
            
            time_54_empty = AcidService.calculate_time_until_empty(
                acid_54_stock, acid_54_inputs, acid_54_outputs
            )
            
            # Créer les structures de données pour cette heure
            acid_28_production = [
                FlowRate(label="Filtre A", value=params.filtre_a_rate),
                FlowRate(label="Filtre B", value=params.filtre_b_rate),
                FlowRate(label="Réception additionnelle", value=params.additional_input_rate)
            ]
            
            acid_28_consumption = [
                FlowRate(label="Echelon J", value=params.echelon_j_rate),
                FlowRate(label="Echelon K", value=params.echelon_k_rate),
                FlowRate(label="Echelon L", value=params.echelon_l_rate),
                FlowRate(label="Consommation DAP 1", value=params.dap1_consumption_rate),
                FlowRate(label="Consommation DAP 2", value=params.dap2_consumption_rate),
                FlowRate(label="Transfert vers CAP", value=params.cap_transfer_rate)
            ]
            
            acid_54_production = [
                FlowRate(label="Production CAP", value=acid_54_production_rate)
            ]
            
            acid_54_consumption = [
                FlowRate(label="Consommation DAP 1", value=params.dap1_consumption_rate * 0.5),
                FlowRate(label="Consommation DAP 2", value=params.dap2_consumption_rate * 0.5)
            ]
            
            acid_28_stock_obj = AcidStock(
                acid_type="ACP_28",
                current_volume=acid_28_stock,
                max_capacity=params.max_acid_28_capacity,
                time_until_empty=time_28_empty,
                readings=[{"hour": hour, "value": acid_28_stock}]
            )
            
            acid_54_stock_obj = AcidStock(
                acid_type="ACP_54",
                current_volume=acid_54_stock,
                max_capacity=params.max_acid_54_capacity,
                time_until_empty=time_54_empty,
                readings=[{"hour": hour, "value": acid_54_stock}]
            )
            
            # Créer l'état du processus pour cette heure
            state = ProcessState(
                timestamp=current_time,
                acid_28_production=acid_28_production,
                acid_28_consumption=acid_28_consumption,
                acid_28_stock=acid_28_stock_obj,
                acid_54_production=acid_54_production,
                acid_54_consumption=acid_54_consumption,
                acid_54_stock=acid_54_stock_obj
            )
            
            timeline.append(state)
            
            # Vérifier les alertes
            if acid_28_stock < params.max_acid_28_capacity * 0.2:
                alerts.append({
                    "timestamp": current_time,
                    "severity": "WARNING",
                    "category": "STOCK",
                    "message": f"Stock d'ACP 28% faible ({acid_28_stock:.2f} m³)",
                    "source": "Simulation"
                })
            
            if acid_54_stock < params.max_acid_54_capacity * 0.2:
                alerts.append({
                    "timestamp": current_time,
                    "severity": "WARNING",
                    "category": "STOCK",
                    "message": f"Stock d'ACP 54% faible ({acid_54_stock:.2f} m³)",
                    "source": "Simulation"
                })
        
        # Créer et retourner le résultat de la simulation
        result = SimulationResult(
            name=f"Simulation du {datetime.now().strftime('%Y-%m-%d %H:%M')}",
            created_at=datetime.now(),
            params=params,
            timeline=timeline,
            alerts=alerts
        )
        
        return result