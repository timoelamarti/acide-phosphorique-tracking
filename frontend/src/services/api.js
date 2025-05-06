// frontend/src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const acidApi = {
  // État actuel du processus
  getCurrentState: () => api.get('/acid/state'),
  updateState: (state) => api.post('/acid/state', state),
  
  // Simulations
  runSimulation: (params) => api.post('/acid/simulate', params),
  getSimulations: () => api.get('/acid/simulations'),
  getSimulationById: (id) => api.get(`/acid/simulations/${id}`),
  
  // Alertes
  getAlerts: (filters) => api.get('/acid/alerts', { params: filters }),
  createAlert: (alert) => api.post('/acid/alerts', alert),
};

export default api;