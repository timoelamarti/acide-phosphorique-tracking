import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, Cell 
} from 'recharts';
import { calculateEfficiency } from '../../utils/processCalculations';
import './ProductionRateWidget.css';

const ProductionRateWidget = ({ productionRates, expectedRates }) => {
  // Préparer les données pour le graphique
  const prepareChartData = () => {
    return [
      {
        name: 'Filtre A',
        actuel: productionRates.filtreA,
        attendu: expectedRates.filtreA,
        efficacité: calculateEfficiency(productionRates.filtreA, expectedRates.filtreA)
      },
      {
        name: 'Filtre B',
        actuel: productionRates.filtreB,
        attendu: expectedRates.filtreB,
        efficacité: calculateEfficiency(productionRates.filtreB, expectedRates.filtreB)
      },
      {
        name: 'Unité CAP',
        actuel: productionRates.cap,
        attendu: expectedRates.cap,
        efficacité: calculateEfficiency(productionRates.cap, expectedRates.cap)
      }
    ];
  };

  const data = prepareChartData();

  const getEfficiencyColor = (efficiency) => {
    if (efficiency < 60) return '#ff4d4d'; // Rouge
    if (efficiency < 85) return '#ffcc00'; // Jaune
    return '#4caf50'; // Vert
  };

  const renderEfficiencyIndicator = (name, efficiency) => {
    const color = getEfficiencyColor(efficiency);
    
    return (
      <div className="efficiency-indicator">
        <div className="indicator-label">{name}</div>
        <div className="indicator-gauge">
          <div 
            className="indicator-value" 
            style={{ width: `${efficiency}%`, backgroundColor: color }}
          ></div>
        </div>
        <div className="indicator-percentage">{efficiency.toFixed(1)}%</div>
      </div>
    );
  };

  return (
    <div className="production-rate-widget">
      <h2>Taux de Production</h2>
      
      <div className="production-comparison">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis unit=" m³/h" />
            <Tooltip formatter={(value) => value.toFixed(2) + ' m³/h'} />
            <Legend />
            <Bar dataKey="actuel" name="Débit actuel" fill="#8884d8" />
            <Bar dataKey="attendu" name="Débit attendu" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="efficiency-indicators">
        <h3>Efficacité de production</h3>
        {data.map((item, index) => (
          renderEfficiencyIndicator(item.name, item.efficacité)
        ))}
      </div>
    </div>
  );
};

export default ProductionRateWidget;