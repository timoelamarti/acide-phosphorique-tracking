// frontend/src/utils/processCalculations.js
export const calculatePercentage = (current, max) => {
    if (max <= 0) return 0;
    return Math.min(100, Math.max(0, (current / max) * 100));
  };
  
  export const formatVolume = (volume, decimals = 2) => {
    return volume.toFixed(decimals) + ' m³';
  };
  
  export const getStatusColor = (percentage) => {
    if (percentage < 20) return 'red';
    if (percentage < 50) return 'yellow';
    return 'green';
  };
  
  export const formatTimeUntilEmpty = (time) => {
    if (time === 'aucun') return 'Stable/En hausse';
    if (typeof time === 'number') {
      const hours = Math.floor(time);
      const minutes = Math.round((time - hours) * 60);
      return `${hours}h ${minutes}m`;
    }
    return 'N/A';
  };
  
  export const calculateEfficiency = (actual, expected) => {
    if (expected <= 0) return 0;
    return Math.min(100, Math.max(0, (actual / expected) * 100));
  };