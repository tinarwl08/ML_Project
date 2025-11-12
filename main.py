from flask import Flask, render_template, request, redirect, url_for, session , jsonify
import requests
from app.advisory.generator import AdvisoryGenerator
from googletrans import Translator
import math


app = Flask(__name__)
app.secret_key = "sdcvdbqw98duhdgcasguc"  # Set secret key for session

# Initialize generator
generator = AdvisoryGenerator()

# OpenWeatherMap settings
API_KEY = "87baea20a5da6861c90160d417ea0675"
LAT = 18.5204
LON = 73.8567

# ---------------- Helper Functions ----------------
def get_weather_data():
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {"lat": LAT, "lon": LON, "appid": API_KEY, "units": "metric"}
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        rainfall = data.get("rain", {}).get("1h", data.get("rain", {}).get("3h", 0.0))
        return {
            "Temperature_C": data["main"]["temp"],
            "Humidity": data["main"]["humidity"],
            "Weather_Description": data["weather"][0]["description"].title(),
            "Rainfall_mm": rainfall
        }
    else:
        raise Exception(f"Weather API Error: {response.status_code} - {response.text}")

def safe_float(value, default=0.0):
    try:
        return float(value)
    except (ValueError, TypeError):
        return default

# ---------------- Routes ----------------
@app.route('/')
def home():
    return render_template('login.html')

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/crop-input", methods=["GET", "POST"])
def crop_input():
    if request.method == "POST":
        try:
            # 1️⃣ Get real-time weather data
            weather = get_weather_data()

            # 2️⃣ Collect farmer inputs from form
            farmer_data = {
                "Crop_Type": request.form.get("Crop_Type"),
                "Soil_Type": request.form.get("Soil_Type"),
                "Soil_pH": safe_float(request.form.get("soilpHVal"), 6.5),
                "Soil_Moisture": safe_float(request.form.get("Soil_Moisture"), 25.0),
                "Temperature_C": weather["Temperature_C"],
                "Rainfall_mm": weather["Rainfall_mm"],
                "Fertilizer_Type": request.form.get("Fertilizer_Used"),
                "Fertilizer_Amount_kg": safe_float(request.form.get("Fertilizer_Amount"), 0.0),
                "Pesticide_Type": request.form.get("Pesticide_Used"),
                "Pesticide_Amount_mL": safe_float(request.form.get("Pesticide_Amount"), 0.0),
                "Area_acre": safe_float(request.form.get("Area_acre"), 2.0),
                "Planting_Date": request.form.get("Planting_Date"),
                "State": request.form.get("State"),
                "District": request.form.get("District"),
                "Village": request.form.get("Village"),
                "Pincode": request.form.get("Pincode"),
                "Irrigation_Method": request.form.get("Irrigation_Method"),
                "Current_Issues": request.form.get("Current_Issues")
            }

            # 3️⃣ Market data (placeholder)
            market_data = {
                "Product": farmer_data["Crop_Type"],
                "Market_Price_per_ton": 270.94,
                "Demand_Index": 0.75,
                "Supply_Index": 0.60,
                "Competitor_Price_per_ton": 260.00,
                "Economic_Indicator": 0.80,
                "Weather_Impact_Score": 0.65,
                "Seasonal_Factor": "Rabi",
                "Consumer_Trend_Index": 0.70
            }

            # 4️⃣ Generate advisory using the generator
            advisory_result = generator.generate(farmer_data, market_data)
            print(advisory_result)

            # 5️⃣ Store results in session
            session['advisory_result'] = advisory_result
            session['farmer_data'] = farmer_data
            session['weather'] = weather

            # 6️⃣ Redirect to advisory page
            return redirect(url_for('advisory'))

        except Exception as e:
            print("Error:", str(e))
            return render_template("crop-input.html", error=str(e))

    # GET request: render form
    return render_template("crop-input.html")

@app.route("/advisory")
def advisory():
    advisory_result = session.get('advisory_result')
    farmer_data = session.get('farmer_data')
    weather = session.get('weather')
    print

    if not advisory_result:
        return redirect(url_for('crop_input'))

    return render_template(
        "advisory.html",
        advisory=advisory_result,
        farmer_data=farmer_data,
        weather=weather
    )

@app.route("/market-trends")
def market_trends():
    return render_template("market-trends.html")

@app.route("/soil-health")
def soil_health():
    return render_template("soil-health.html")

@app.route("/chat-bot")
def chat_bot():
    return render_template("Chat_boat.html")

# ---------------- Main ----------------
if __name__ == "__main__":
    app.run(debug=True)
