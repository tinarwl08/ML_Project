import requests
import json

url = "http://127.0.0.1:8000/recommend"

payload = {
    "farmer": {
        "Crop_Type": "Wheat",
        "Soil_pH": 6.5,
        "Soil_Moisture": 22.0,
        "Temperature_C": 28.0,
        "Rainfall_mm": 150.0,
        "Fertilizer_Usage_kg": 50.0,
        "Pesticide_Usage_kg": 2.5,
        "Area_acre": 2.0
    },
    "market": {
        "Product": "Wheat",
        "Market_Price_per_ton": 270.94,
        "Demand_Index": 0.75,
        "Supply_Index": 0.60,
        "Competitor_Price_per_ton": 260.00,
        "Economic_Indicator": 0.80,
        "Weather_Impact_Score": 0.65,
        "Seasonal_Factor": "Rabi",
        "Consumer_Trend_Index": 0.70
    }
}

response = requests.post(url, json=payload)

if response.status_code == 200:
    result = response.json()
    # print exactly the JSON you want
    print(json.dumps(result, indent=2))
else:
    print("Error:", response.status_code, response.text)
