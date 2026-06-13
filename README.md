# TickerDance

## Project Overview

TickerDance transforms real stock market data into dynamic 3D dance animations. Users select from 22 supported stocks across US and Indian markets, choose date ranges, and pick from 5 dance styles (hip-hop, ballet, classical, robot, breakdance). The backend analyzes stock metrics (volatility, momentum, volume, trend) via yfinance, and the frontend renders interactive Three.js dancers with procedurally generated music using the Web Audio API. Dance speed and music tempo are driven by market volatility — high volatility stocks dance faster and more intensely than stable stocks. Each analysis produces a reproducible choreography seed ensuring identical inputs always generate the same BPM and musical pattern.

## Tech Stack

- **Frontend:** React + Vite, @react-three/fiber, @react-three/drei, Three.js, Axios
- **Backend:** Python FastAPI, yfinance, pandas, numpy, pydantic, python-dotenv, uvicorn

## Folder Structure

```
TickerDance/
├── frontend/
│   ├── public/
│   │   ├── dancer.fbx          # Hip-hop 3D model
│   │   ├── Ballet.fbx          # Ballet 3D model
│   │   ├── Classical.fbx       # Classical 3D model
│   │   ├── Robot.fbx           # Robot 3D model
│   │   └── Breakdance.fbx      # Breakdance 3D model
│   ├── src/
│   │   ├── components/
│   │   │   ├── Controls.jsx    # Stock/date/style selection panel
│   │   │   ├── Stage.jsx       # Canvas with particles, BPM display, controls
│   │   │   ├── Dancer.jsx      # 3D dancer using Three.js/FBX models
│   │   │   └── MusicEngine.jsx # Web Audio API music generation
│   │   ├── App.jsx             # Main app with 3-column layout
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Tailwind CSS v4 import
│   ├── index.html              # HTML entry point
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI server with /api/analyze endpoint
│   │   ├── stock_data.py       # Stock data analysis with dance parameter calculation
│   │   ├── models.py           # Pydantic request/response models
│   │   └── __init__.py
│   ├── requirements.txt
│   └── .env
└── README.md
```

## Features

- **3D Visualization:** Interactive Three.js dancer models with 5 dance styles (hip-hop, ballet, classical, robot, breakdance)
- **Dynamic Music:** Procedurally generated music using Web Audio API based on stock volatility, momentum, and trend
- **Visual Effects:** Pulse rings, particles, and BPM indicators that respond to market data
- **Market Glossary:** In-app explanations of volatility, momentum, volume, trend, energy, and BPM metrics
- **Controls:** Mute/unmute audio, pause/resume animation, shareable choreography seeds
- **Dancer Color:** Green for bullish momentum, orange for bearish momentum, blue for sideways movement — color changes dynamically based on real market trend direction
- **Dance DNA Panel:** Live metric bars showing volatility, momentum, volume, trend, energy and tempo with market direction badge (BULLISH, BEARISH, SIDEWAYS) and unique choreography seed

## Installation & Setup

### 1. Backend Setup

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create a Python virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - macOS / Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install backend dependencies from `requirements.txt`:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the backend server with Uvicorn:
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

### 2. Frontend Setup

1. Open a second terminal and navigate to the frontend folder:
    ```bash
    cd frontend
    ```

2. Install frontend dependencies:
    ```bash
    npm install
    ```

3. Start the Vite development server:
    ```bash
    npm run dev
    ```

4. Open the app in the browser using the local URL Vite displays, usually `http://localhost:5173`.

## API Endpoint

### POST `/api/analyze`

Request body:
```json
{
  "company_name": "Infosys",
  "start_date": "2024-01-01",
  "end_date": "2024-06-01",
  "dance_style": "hip-hop"
}
```

Response:
```json
{
  "company_name": "Infosys",
  "ticker": "INFY",
  "dance_parameters": {
    "volatility": 0.25,
    "momentum": 0.15,
    "volume_intensity": 0.62,
    "trend_direction": 1.0,
    "price_range_normalized": 0.18
  }
}
```

## Notes

- Make sure the backend is running before loading stock data in the frontend.
- The frontend uses Axios to request stock and animation data from the FastAPI backend at `http://localhost:8000/api/analyze`.
- 3D FBX models are located in `frontend/public/` and load automatically for each dance style.
- Same inputs (company, date range, dance style) always produce the same choreography seed for reproducible results.

## Supported Stock Markets

- **Stable (Low BPM):** Coca-Cola, Johnson & Johnson, Procter & Gamble, Walmart, Berkshire Hathaway, Asian Paints, Nestle India, Hindustan Unilever
- **Indian Markets:** Infosys, TCS, Wipro, HCL Tech, Reliance, HDFC Bank, Zomato, Paytm, Adani Enterprises, Yes Bank
- **US Stable:** Apple, Microsoft, Google, Amazon, Netflix
- **High Volatility (High BPM):** Tesla, Nvidia, GameStop, AMC, Coinbase, Rivian, Palantir

## Dance Styles

| Style | Animation | Speed | Music Character |
|-------|-----------|-------|-----------------|
| Hip-Hop | 3D Mixamo FBX | Fast (1.0x base) | Sharp beats, sawtooth rhythm |
| Ballet | 3D Mixamo FBX | Slow (0.4x base) | Soft melodic tones |
| Classical | 3D Mixamo FBX | Medium (0.7x base) | Smooth flowing notes |
| Robot | 3D Mixamo FBX | Medium-slow (0.5x base) | Electronic arpeggios |
| Breakdance | 3D Mixamo FBX | Very Fast (1.5x base) | High energy scratches |

Note: All speeds are further multiplied by market 
volatility — high volatility stocks dance faster 
regardless of style.