# Application de Suivi des Flux d'Acide Phosphorique

Cette application permet de suivre en temps réel les flux d'acide phosphorique (ACP 28% et ACP 54%) dans un processus industriel, depuis la production (filtres A et B) jusqu'à la consommation (échelons J, K, L, production DAP).

## Fonctionnalités

- **Tableau de bord** : Visualisation en temps réel des flux et stocks d'acide
- **Simulations** : Exécution de scénarios pour anticiper les variations de production
- **Alertes** : Notification de situations critiques (stocks bas, anomalies de production)
- **Analyses** : Tendances de consommation et génération de rapports
- **Profil** : Personnalisation de l'interface utilisateur

## Technologies utilisées

### Backend
- Python 3.9+
- FastAPI
- Pydantic
- NumPy
- Pandas

### Frontend
- React 18
- React Router
- Recharts
- Axios

## Installation

### Backend

1. Naviguez vers le dossier backend
   ```bash
   cd backend