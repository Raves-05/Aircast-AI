@echo off
title AirCast AI Setup

echo [1/3] Setting up Machine Learning Model...
cd ml
python -m venv venv
call venv\Scripts\activate
pip install numpy scikit-learn pandas
python train.py
:: ADDED "call" right here so it doesn't crash!
call deactivate
cd ..

echo [2/3] Setting up Backend API...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
start "AirCast Backend" cmd /k "call venv\Scripts\activate && uvicorn main:app --reload --port 8000"
cd ..

echo [3/3] Setting up Frontend UI...
cd frontend
call npm install
start "AirCast Frontend" cmd /k "npm run dev"
cd ..

echo ==================================================
echo AirCast AI is starting!
echo DO NOT CLOSE THIS WINDOW.
echo.
echo Wait about 30 seconds for the servers to boot up, then go to:
echo Frontend: http://localhost:3000
echo ==================================================
pause