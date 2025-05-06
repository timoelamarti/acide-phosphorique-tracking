# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import acid_routes
import uvicorn

app = FastAPI(
    title="API de Suivi des Flux d'Acide Phosphorique",
    description="API pour le suivi en temps réel des flux d'acide phosphorique (ACP 28% et ACP 54%)",
    version="1.0.0"
)

# Configuration CORS pour permettre les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À remplacer par l'URL de votre frontend en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routes
app.include_router(acid_routes.router)

@app.get("/")
async def root():
    return {"message": "Bienvenue sur l'API de suivi des flux d'acide phosphorique"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)