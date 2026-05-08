# ☁️ AirCast AI

> **Advanced Air Pollution Forecasting System** > *An academic project inspired by the ISRO Smart India Hackathon (SIH) Problem Statements.*

![AirCast AI Dashboard Preview](https://via.placeholder.com/1000x500.png?text=AirCast+AI+Dashboard+-+Replace+With+Real+Screenshot)

## 📖 Overview
AirCast AI is a full-stack, predictive machine-learning dashboard designed to monitor and forecast air quality (AQI) across the Indian subcontinent. Traditional weather apps provide static data; AirCast AI uses historical geospatial telemetry and a simulated Long Short-Term Memory (LSTM) neural network to predict future pollution trends, helping vulnerable demographics make informed health decisions.

## ✨ Key Features
* **🌍 Live Geospatial Telemetry:** Interactive, region-locked satellite map of India using **Leaflet.js**, featuring live-updating city nodes and AQI heatmap auras.
* **📈 ML-Driven Forecasting:** 24-hour and 7-day predictive trajectories powered by a simulated Python/FastAPI backend modeling an LSTM Neural Network.
* **📊 "Command Center" Analytics:** High-fidelity interactive charts built with **Recharts** and fluid UI transitions powered by **Framer Motion**.
* **🔒 Secure User Sessions:** Built-in authentication system with localized user context and dynamic, time-aware greetings.
* **💎 Premium Frosted-Glass UI:** A custom, highly polished "glassmorphism" aesthetic built entirely with **Tailwind CSS**.

## 🛠️ Tech Stack

**Frontend (Client)**
* [Next.js (React)](https://nextjs.org/) - Core framework
* [Tailwind CSS](https://tailwindcss.com/) - Styling & Glassmorphism
* [Framer Motion](https://www.framer.com/motion/) - Cinematic animations
* [Leaflet.js & React-Leaflet](https://react-leaflet.js.org/) - Interactive GIS mapping
* [Recharts](https://recharts.org/) - Data visualization

**Backend (API & ML Simulation)**
* [Python 3](https://www.python.org/) - Core language
* [FastAPI](https://fastapi.tiangolo.com/) - High-performance API routing
* [Uvicorn](https://www.uvicorn.org/) - ASGI server
* *Libraries:* Pandas, NumPy, Scikit-Learn, TensorFlow/Keras

---

## 🚀 Getting Started (Local Development)

To run AirCast AI on your local machine, you will need to run both the Backend API and the Frontend client simultaneously.

### 1. Start the Python Backend
```bash
cd backend
# Create a virtual environment (optional but recommended)
python -m venv venv
venv\Scripts\activate  # On Windows
# Install dependencies
pip install -r requirements.txt
# Start the FastAPI server
uvicorn main:app --reload --port 8000