// frontend/src/components/dashboard/ProcessFlowDiagram.js
import React from 'react';
import { calculatePercentage, formatVolume, getStatusColor } from '../../utils/processCalculations';
import './ProcessFlowDiagram.css';

const ProcessFlowDiagram = ({ processState }) => {
  // Vérifier si les données sont disponibles
  if (!processState) {
    return <div className="process-flow-loading">Chargement du diagramme de flux...</div>;
  }

  // Extraire les données du processState
  const {
    acid_28_production,
    acid_28_consumption,
    acid_28_stock,
    acid_54_production,
    acid_54_consumption,
    acid_54_stock
  } = processState;

  // Calculer les pourcentages de stock pour la visualisation
  const acid28Percentage = calculatePercentage(
    acid_28_stock.current_volume, 
    acid_28_stock.max_capacity
  );
  
  const acid54Percentage = calculatePercentage(
    acid_54_stock.current_volume, 
    acid_54_stock.max_capacity
  );

  // Déterminer les couleurs en fonction des niveaux de stock
  const acid28Color = getStatusColor(acid28Percentage);
  const acid54Color = getStatusColor(acid54Percentage);

  return (
    <div className="process-flow-diagram">
      <h2>Diagramme de flux du processus en temps réel</h2>
      
      <div className="diagram-container">
        {/* Bac d'attaque et filtres */}
        <div className="process-node attack-tank">
          <div className="node-title">Bac d'attaque</div>
          <div className="node-body">
            <div className="node-icon tank-icon"></div>
            <div className="node-status active">Actif</div>
          </div>
        </div>
        
        <div className="process-arrow"></div>
        
        <div className="process-node-group filters">
          <div className="process-node filter-a">
            <div className="node-title">Filtre A</div>
            <div className="node-body">
              <div className="node-icon filter-icon"></div>
              <div className="node-value">
                {acid_28_production[0].value.toFixed(2)} m³/h
              </div>
            </div>
          </div>
          
          <div className="process-node filter-b">
            <div className="node-title">Filtre B</div>
            <div className="node-body">
              <div className="node-icon filter-icon"></div>
              <div className="node-value">
                {acid_28_production[1].value.toFixed(2)} m³/h
              </div>
            </div>
          </div>
        </div>
        
        <div className="process-arrow"></div>
        
        {/* Stockage ACP 28% */}
        <div 
          className={`process-node storage-tank acid-28-tank status-${acid28Color}`}
          onClick={() => alert(`Stock ACP 28%: ${formatVolume(acid_28_stock.current_volume)}`)}
        >
          <div className="node-title">Stock ACP 28%</div>
          <div className="node-body">
            <div className="node-icon tank-icon"></div>
            <div className="tank-level" style={{ height: `${acid28Percentage}%` }}></div>
            <div className="node-value">
              {formatVolume(acid_28_stock.current_volume)}
              <span className="capacity-label">
                {acid28Percentage.toFixed(0)}% de la capacité
              </span>
            </div>
          </div>
        </div>
        
        {/* Distribution */}
        <div className="process-distribution">
          <div className="distribution-arrows">
            <div className="process-arrow to-echelon"></div>
            <div className="process-arrow to-cap"></div>
            <div className="process-arrow to-dap"></div>
          </div>
          
          <div className="distribution-nodes">
            {/* Échelons J, K, L */}
            <div className="process-node-group echelons">
              <div className="node-title">Échelons</div>
              <div className="echelon-nodes">
                <div className="process-node echelon-j">
                  <div className="node-title">J</div>
                  <div className="node-value">
                    {acid_28_consumption[0].value.toFixed(2)} m³/h
                  </div>
                </div>
                <div className="process-node echelon-k">
                  <div className="node-title">K</div>
                  <div className="node-value">
                    {acid_28_consumption[1].value.toFixed(2)} m³/h
                  </div>
                </div>
                <div className="process-node echelon-l">
                  <div className="node-title">L</div>
                  <div className="node-value">
                    {acid_28_consumption[2].value.toFixed(2)} m³/h
                  </div>
                </div>
              </div>
            </div>
            
            {/* CAP (unité de concentration) */}
            <div className="process-node cap-unit">
              <div className="node-title">Unité CAP</div>
              <div className="node-body">
                <div className="node-icon processor-icon"></div>
                <div className="node-value">
                  {acid_28_consumption[5].value.toFixed(2)} m³/h ⟶ {acid_54_production[0].value.toFixed(2)} m³/h
                </div>
              </div>
            </div>
            
            {/* Stockage ACP 54% */}
            <div 
              className={`process-node storage-tank acid-54-tank status-${acid54Color}`}
              onClick={() => alert(`Stock ACP 54%: ${formatVolume(acid_54_stock.current_volume)}`)}
            >
              <div className="node-title">Stock ACP 54%</div>
              <div className="node-body">
                <div className="node-icon tank-icon"></div>
                <div className="tank-level" style={{ height: `${acid54Percentage}%` }}></div>
                <div className="node-value">
                  {formatVolume(acid_54_stock.current_volume)}
                  <span className="capacity-label">
                    {acid54Percentage.toFixed(0)}% de la capacité
                  </span>
                </div>
              </div>
            </div>
            
            {/* Production DAP */}
            <div className="process-node-group dap-production">
              <div className="node-title">Production DAP</div>
              <div className="dap-nodes">
                <div className="process-node dap-1">
                  <div className="node-title">DAP 1</div>
                  <div className="node-body">
                    <div className="node-icon production-icon"></div>
                    <div className="node-values">
                      <div>ACP 28%: {acid_28_consumption[3].value.toFixed(2)} m³/h</div>
                      <div>ACP 54%: {acid_54_consumption[0].value.toFixed(2)} m³/h</div>
                    </div>
                  </div>
                </div>
                <div className="process-node dap-2">
                  <div className="node-title">DAP 2</div>
                  <div className="node-body">
                    <div className="node-icon production-icon"></div>
                    <div className="node-values">
                      <div>ACP 28%: {acid_28_consumption[4].value.toFixed(2)} m³/h</div>
                      <div>ACP 54%: {acid_54_consumption[1].value.toFixed(2)} m³/h</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="diagram-legend">
        <div className="legend-item">
          <div className="legend-color status-green"></div>
          <span>Normal (&gt;50%)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color status-yellow"></div>
          <span>Attention (20-50%)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color status-red"></div>
          <span>Critique (&lt;20%)</span>
        </div>
      </div>
    </div>
  );
};

export default ProcessFlowDiagram;