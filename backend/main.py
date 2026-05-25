from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import math
import datetime
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

CITY_BASELINES = {
    "Delhi": {"aqi": 171, "pm25": 94.5, "pm10": 140.2, "o3": 46.7, "no2": 19.8, "so2": 9.9, "co": 0.85, "temperature": 28},
    "Kolkata": {"aqi": 152, "pm25": 75.1, "pm10": 110.5, "o3": 38.2, "no2": 29.1, "so2": 12.0, "co": 0.9, "temperature": 30},
    "Mumbai": {"aqi": 110, "pm25": 45.2, "pm10": 85.0, "o3": 42.1, "no2": 25.4, "so2": 8.5, "co": 0.7, "temperature": 31},
    "Bengaluru": {"aqi": 85, "pm25": 25.5, "pm10": 55.3, "o3": 30.0, "no2": 18.2, "so2": 5.1, "co": 0.5, "temperature": 24},
    "Chennai": {"aqi": 92, "pm25": 30.1, "pm10": 65.8, "o3": 35.5, "no2": 20.9, "so2": 7.2, "co": 0.6, "temperature": 33},
}

@app.get("/city/{city_name}")
async def get_city_data(city_name: str):
    city = city_name.capitalize()
    base = CITY_BASELINES.get(city, CITY_BASELINES["Delhi"])
    
    if base["aqi"] <= 50: status = "Good"
    elif base["aqi"] <= 100: status = "Moderate"
    elif base["aqi"] <= 150: status = "Unhealthy for Sensitive Groups"
    else: status = "Poor"

    return {"city": city, **base, "status": status}

@app.get("/forecast/{city_name}")
async def get_forecast(city_name: str):
    city = city_name.capitalize()
    base_aqi = CITY_BASELINES.get(city, CITY_BASELINES["Delhi"])["aqi"]
    forecast = []
    for i in range(24):
        hour = (datetime.datetime.now().hour + i) % 24
        peak = math.sin((hour - 4) * math.pi / 12) * 20
        forecast.append({"time": f"{hour:02d}:00", "aqi": int(base_aqi + peak)})
    return forecast

# NEW ENDPOINT: ML Model Analytics
@app.get("/metrics")
async def get_metrics():
    # Simulated metrics for the MVP presentation
    return {
        "rmse": 12.4,
        "mae": 8.7,
        "confidence_score": 94.2,
        "model_type": "LSTM Neural Network",
        "last_trained": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "insights": [
            {"feature": "Traffic Volume", "importance": 85},
            {"feature": "Industrial Output", "importance": 72},
            {"feature": "Temperature", "importance": 60},
            {"feature": "Wind Speed", "importance": 45},
            {"feature": "Humidity", "importance": 30}
        ],
        "performance_history": [
            {"day": "Mon", "actual": 145, "predicted": 150},
            {"day": "Tue", "actual": 130, "predicted": 128},
            {"day": "Wed", "actual": 160, "predicted": 155},
            {"day": "Thu", "actual": 175, "predicted": 180},
            {"day": "Fri", "actual": 150, "predicted": 148},
            {"day": "Sat", "actual": 110, "predicted": 115},
            {"day": "Sun", "actual": 105, "predicted": 100}
        ]
    }