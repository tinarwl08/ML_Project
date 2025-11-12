from pydantic import BaseModel
from typing import Optional, Dict, Any



class FarmerInput(BaseModel):
    Crop_Type: str
    Soil_pH: float
    Soil_Moisture: float
    Temperature_C: float
    Rainfall_mm: float
    Fertilizer_Usage_kg: float
    Pesticide_Usage_kg: float
    Area_acre: Optional[float] = 1.0

class MarketInput(BaseModel):
    Product: str
    Market_Price_per_ton: Optional[float] = None
    Demand_Index: float
    Supply_Index: float
    Competitor_Price_per_ton: float
    Economic_Indicator: float
    Weather_Impact_Score: float
    Seasonal_Factor: str
    Consumer_Trend_Index: float

class AdvisoryResponse(BaseModel):
    recommended_crop: str
    expected_yield_ton_per_acre: float
    expected_price_per_ton: float
    expected_revenue: float
    optimal_fertilizer_kg_per_acre: float
    optimal_pesticide_kg_per_acre: float
    soil_health_label: str
    weather_risk_label: str
    messages: Dict[str, Any]

class RecommendationRequest(BaseModel):
    farmer: FarmerInput
    market: MarketInput
