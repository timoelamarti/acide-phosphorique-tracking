import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { formatVolume, formatTimeUntilEmpty, calculatePercentage, getStatusColor } from '../../utils/processCalculations';
import './StockLevelSummary.css';

const StockLevelSummary = ({ acid28Stock, acid54Stock, history }) => {
  // Transformer l'historique pour l'affichage graphique
  const chartData = history.map((entry) => ({
    timestamp: new Date(entry.timestamp).toLocaleTimeString(),
    acid28: entry.acid_28_stock.current_volume,
    acid54: entry.acid_54_stock.current_volume
  }));

  const renderStockPanel = (stock, title, color) => {
    if (!stock) return null;
    
    const percentage = calculatePercentage(stock.current_volume, stock.max_capacity);
    const statusColor = getStatusColor(percentage);
    
    return (
      <div className={`stock-panel status-${statusColor}`}>
        <h3>{title}</h3>
        <div className="volume-display">
          <div className="volume-value">
            {formatVolume(stock.current_volume)}
          </div>
          <div className="volume-percentage">
            {percentage.toFixed(1)}% de la capacité maximale
          </div>
        </div>
        
        <div className="stock-gauge">
          <div 
            className="stock-level-indicator" 
            style={{ width: `${percentage}%`, backgroundColor: statusColor }}
          ></div>
        </div>
        
        <div className="time-until-empty">
          <span className="label">Temps restant:</span>
          <span className="value">{formatTimeUntilEmpty(stock.time_until_empty)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="stock-level-summary">
      <div className="stock-panels">
        {renderStockPanel(acid28Stock, "ACP 28%", "blue")}
        {renderStockPanel(acid54Stock, "ACP 54%", "green")}
      </div>
      
      <div className="stock-trend-chart">
        <h3>Tendance des stocks (72 dernières heures)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip 
              formatter={(value) => formatVolume(value)}
              labelFormatter={(label) => `Heure: ${label}`}
            />
            <ReferenceLine y={acid28Stock?.max_capacity * 0.2} stroke="red" strokeDasharray="3 3" />
            <Line 
              type="monotone" 
              dataKey="acid28" 
              stroke="#8884d8" 
              name="ACP 28%" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="acid54" 
              stroke="#82ca9d" 
              name="ACP 54%" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockLevelSummary;