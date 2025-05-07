// frontend/src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import ProcessFlowDiagram from '../components/dashboard/ProcessFlowDiagram';
import StockLevelSummary from '../components/dashboard/StockLevelSummary';
import ProductionRateWidget from '../components/dashboard/ProductionRateWidget';
import { acidApi } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [processState, setProcessState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  
  useEffect(() => {
    fetchCurrentState();
    // Mettre à jour toutes les 60 secondes
    const intervalId = setInterval(fetchCurrentState, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Fonction modifiée pour utiliser directement les données de test
  const fetchCurrentState = () => {
    // Utiliser directement les données de test
    generateTestData();
    setLoading(false);
  };
  
  const generateTestData = () => {
    // Données de test pour la démonstration
    const testData = {
      timestamp: new Date(),
      acid_28_production: [
        { label: 'Filtre A', value: 120.5 },
        { label: 'Filtre B', value: 85.3 },
        { label: 'Réception additionnelle', value: 0.0 }
      ],
      acid_28_consumption: [
        { label: 'Echelon J', value: 45.2 },
        { label: 'Echelon K', value: 38.1 },
        { label: 'Echelon L', value: 42.6 },
        { label: 'Consommation DAP 1', value: 15.8 },
        { label: 'Consommation DAP 2', value: 12.5 },
        { label: 'Transfert vers CAP', value: 50.0 }
      ],
      acid_28_stock: {
        acid_type: 'ACP_28',
        current_volume: 850.0,
        max_capacity: 1000.0,
        time_until_empty: 18.5,
        readings: [{ hour: 0, value: 850.0 }]
      },
      acid_54_production: [
        { label: 'Production CAP', value: 45.0 }
      ],
      acid_54_consumption: [
        { label: 'Consommation DAP 1', value: 7.9 },
        { label: 'Consommation DAP 2', value: 6.3 }
      ],
      acid_54_stock: {
        acid_type: 'ACP_54',
        current_volume: 550.0,
        max_capacity: 800.0,
        time_until_empty: 24.3,
        readings: [{ hour: 0, value: 550.0 }]
      }
    };
    
    setProcessState(testData);
    setHistoricalData([testData]);
  };
  
  // Préparer les données pour le widget de taux de production
  const prepareProductionRates = () => {
    if (!processState) return { productionRates: {}, expectedRates: {} };
    
    const productionRates = {
      filtreA: processState.acid_28_production[0].value,
      filtreB: processState.acid_28_production[1].value,
      cap: processState.acid_54_production[0].value
    };
    
    // Valeurs attendues (hypothétiques)
    const expectedRates = {
      filtreA: 130.0,
      filtreB: 100.0,
      cap: 50.0
    };
    
    return { productionRates, expectedRates };
  };
  
  const { productionRates, expectedRates } = prepareProductionRates();
  
  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Chargement du tableau de bord...</h2>
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Erreur</h2>
        <p>{error}</p>
        <button onClick={fetchCurrentState}>Réessayer</button>
      </div>
    );
  }
  
  return (
    <div className="dashboard-page">
      <h1>Tableau de bord des flux d'acide phosphorique</h1>
      
      <div className="dashboard-section">
        <ProcessFlowDiagram processState={processState} />
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-section stock-section">
          <StockLevelSummary 
            acid28Stock={processState.acid_28_stock}
            acid54Stock={processState.acid_54_stock}
            history={historicalData}
          />
        </div>
        
        <div className="dashboard-section production-section">
          <ProductionRateWidget 
            productionRates={productionRates}
            expectedRates={expectedRates}
          />
        </div>
      </div>
      
      <div className="dashboard-footer">
        <div className="last-update">
          Dernière mise à jour: {new Date(processState.timestamp).toLocaleString()}
        </div>
        <button onClick={fetchCurrentState} className="refresh-btn">
          Rafraîchir les données
        </button>
      </div>
    </div>
  );
};

export default Dashboard;