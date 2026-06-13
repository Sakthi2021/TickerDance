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
├── mcp_server/
│   ├── server.py               # MCP server with analyze_stock_data tool
│   └── requirements.txt
├── ticker.json                 # MCP server configuration
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
### MCP Server (Optional)

The MCP server enables programmatic access to TickerDance stock analysis:

1. Create a virtual environment and install dependencies:
    ```bash
    cd mcp_server
    python -m venv venv
    .\venv\Scripts\activate    # Windows
    # or: source venv/bin/activate  # macOS/Linux
    pip install -r requirements.txt
    ```

2. Set the `KILO_CONFIG` environment variable to load the configuration:
    ```bash
    # Windows PowerShell
    $env:KILO_CONFIG="C:\path\to\TickerDance\ticker.json"
    
    # macOS/Linux
    export KILO_CONFIG=/path/to/TickerDance/ticker.json
    ```

3. Run the MCP server:
    ```bash
    python mcp_server/server.py
    ```

Or configure directly in your MCP client by setting the environment variable to point to `ticker.json`.

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

## MCP Server

TickerDance exposes 5 MCP tools that allow
GitHub Copilot and other AI agents to analyze
stock market behavior, compare companies, and
understand dance choreography — all without
opening the browser.

### Setup

1. Navigate to mcp_server folder:
   cd mcp_server

2. Install dependencies:
   pip install -r requirements.txt

3. Start the MCP server:
   python server.py

4. The .vscode/mcp.json file is included for
   VS Code GitHub Copilot integration.
   Open VS Code, go to Copilot Chat,
   switch to Agent Mode and the tools
   will be available automatically.

### MCP Tools

#### Tool 1: analyze_stock_data
Fetches real stock market data for a company
and returns dance parameters that control the
3D dance animation in TickerDance.

Input:
  company_name: "Tesla"
  start_date: "2024-01-01"
  end_date: "2024-06-01"
  dance_style: "hip-hop"

Example Copilot query:
  "Use TickerDance to analyze Tesla stock
   from 2024-01-01 to 2024-06-01 with hip-hop style"

Example output:
  Company: Tesla
  Ticker: TSLA
  BPM: 127
  Market mood: INTENSE
  Dancer color: ORANGE (BEARISH)
  Interpretation: Tesla has INTENSE market behavior
  with BPM of 127. Dancer will appear ORANGE (BEARISH).

---

#### Tool 2: get_market_mood
Analyzes stock data and returns a unique market
personality label that explains WHY the dancer
moves the way it does in TickerDance.

Personality labels:
  THE WILDCARD - high volatility, bullish
  THE REBEL - high volatility, bearish
  THE STEADY CLIMBER - low volatility, bullish
  THE INTROVERT - low volatility, bearish
  THE CROWD PLEASER - high volume, bullish
  THE FALLEN STAR - high volume, bearish
  THE CHAMPION - strong momentum
  THE PHILOSOPHER - neutral sideways

Input:
  company_name: "GameStop"
  start_date: "2024-01-01"
  end_date: "2024-06-01"

Example Copilot query:
  "Use get_market_mood tool to find the
   personality of GameStop from 2024-01-01
   to 2024-06-01"

Example output:
  Personality: THE WILDCARD
  Description: GameStop is extremely volatile
  with strong upward momentum. High risk,
  high reward energy.
  Dance vibe: Explosive hip-hop with green
  particles everywhere and very fast BPM.
  BPM: 170

---

#### Tool 3: recommend_date_range
Scans the last 60 days of stock data and finds
the most volatile and interesting 30-day period
for a company — helping users find the best
dates for the most dramatic dance performance.

Input:
  company_name: "Tesla"

Example Copilot query:
  "What is the best date range to generate
   the most dramatic dance for Tesla
   in TickerDance?"

Example output:
  Recommended start date: YYYY-MM-DD
  Recommended end date: YYYY-MM-DD
  Volatility score: 85%
  Expected BPM: 160
  Tip: Open TickerDance, select Tesla,
  set these dates for the most dramatic
  dance performance.

---

#### Tool 4: get_company_profile
Returns detailed profile for any supported company
including sector, country, market category,
expected BPM range, dance personality trait
and a fun market fact.

Input:
  company_name: "GameStop"

Example Copilot query:
  "Tell me about GameStop's profile and
   what kind of dancer it is in TickerDance"

Example output:
  Company: GameStop
  Ticker: GME
  Sector: Retail
  Country: USA
  Market category: Extreme Volatility
  Expected BPM range: 150-180
  Dance trait: Meme stock madness — Reddit-driven
  chaos creates the most frantic dance possible
  Fun fact: Rose 1700% in January 2021 driven
  by Reddit WallStreetBets

---

#### Tool 5: compare_stocks
Compares two companies side by side and determines
which one has a more energetic and dramatic dance
performance in TickerDance. Perfect for live demos.

Input:
  company_a: "Coca-Cola"
  company_b: "GameStop"
  start_date: "2024-01-01"
  end_date: "2024-06-01"

Example Copilot query:
  "Compare Coca-Cola and GameStop in TickerDance
   from 2024-01-01 to 2024-06-01. Which one
   dances more intensely?"

Example output:
  Winner: GameStop
  BPM difference: 122
  Coca-Cola BPM: 48, Volatility: 5%, Energy: 13
  GameStop BPM: 170, Volatility: 93%, Energy: 66
  Verdict: GameStop dances significantly more
  intensely than Coca-Cola in that date range.

---

### Architecture

The MCP server sits as a parallel layer
alongside the frontend:

Frontend (React)
  calls backend directly via axios

GitHub Copilot Agent Mode
  calls MCP tools
  MCP Server calls FastAPI backend
  FastAPI calls yfinance
  Returns formatted response to Copilot

MCP is not involved when user clicks
Generate Dance in the browser.
MCP is only used when an AI agent
queries the tools directly.

### Requirements

Make sure the FastAPI backend is running
before using MCP tools:
  cd backend
  uvicorn app.main:app --reload

Then start MCP server:
  cd mcp_server
  python server.py

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