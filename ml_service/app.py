from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from forecasting_models import FreightRateForecaster, DemurrageRiskClassifier
from optimizer_engine import optimize_charter

app = FastAPI(title="VoyageIQ ML Analytics Engine")

forecaster = FreightRateForecaster()
risk_classifier = DemurrageRiskClassifier()

class CalculatorRequest(BaseModel):
    cargoQuantity: float = 70000
    cargoType: str = "Coking Coal"
    origin: str = "Gladstone"
    destination: str = "Paradip"
    vesselClass: str = "PANAMAX"
    contractType: str = "Spot Voyage"
    freightRate: float = 18.42
    fuelPrice: float = 620
    demurrageRate: float = 20000
    expectedWaiting: float = 2.5
    handlingRate: float = 1500
    fuelPriceDeltaPct: float = 0
    freightRateDeltaPct: float = 0
    overrideWaitingDays: Optional[float] = None

@app.post("/api/calculator")
def calculate_ml_metrics(req: CalculatorRequest):
    # Effective rate calculations incorporating scenario deltas
    eff_freight = req.freightRate * (1 + req.freightRateDeltaPct / 100.0)
    eff_fuel = req.fuelPrice * (1 + req.fuelPriceDeltaPct / 100.0)
    waiting_days = req.overrideWaitingDays if req.overrideWaitingDays is not None else req.expectedWaiting

    # Predictive ML inferences
    predicted_rate = forecaster.predict(distance_nm=4500, cargo_volume=req.cargoQuantity)
    risk_score = risk_classifier.predict_risk_score(month=6, queue_count=int(waiting_days * 1.5), draft_ratio=0.9)
    
    # Port constraint evaluation & cost optimization
    optimization = optimize_charter(
        cargo_volume=req.cargoQuantity,
        destination_port=req.destination,
        freight_rate=eff_freight,
        risk_score=risk_score
    )

    return {
        "predicted_freight_rate": predicted_rate,
        "effective_freight_rate": round(eff_freight, 2),
        "effective_fuel_price": round(eff_fuel, 2),
        "demurrage_risk_score": risk_score,
        "optimization": optimization
    }