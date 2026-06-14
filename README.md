# TickerDance

## Project Overview

TickerDance transforms real stock market data into dynamic 3D dance animations. Users select from 22 supported stocks across US and Indian markets, choose date ranges, and pick from 5 dance styles (hip-hop, ballet, classical, robot, breakdance). The backend analyzes stock metrics (volatility, momentum, volume, trend) via yfinance, and the frontend renders interactive Three.js dancers with procedurally generated music using the Web Audio API. Dance speed and music tempo are driven by market volatility — high volatility stocks dance faster and more intensely than stable stocks. Each analysis produces a reproducible choreography seed ensuring identical inputs always generate the same BPM and musical pattern.

## Tech Stack

- **Frontend:** React + Vite, @react-three/fiber, @react-three/drei, Three.js, Axios
- **Backend:** Python FastAPI, yfinance, pandas, numpy, pydantic, python-dotenv, uvicorn

## Folder Structure

```
TickerDance/
├── .vscode/
│   └── mcp.json                # GitHub Copilot MCP configuration
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
configuration
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

TickerDance exposes 5 MCP tools that integrate with GitHub Copilot Agent Mode in VS Code. These tools allow AI agents to analyze real stock market behavior, discover company dance personalities, compare stocks, and find the most dramatic date ranges — all through natural language without opening the browser.

### Quick Start with GitHub Copilot

1. Open project in VS Code
2. The `.vscode/mcp.json` is already configured
3. Start backend: `uvicorn app.main:app --reload`
4. Start MCP server: `python mcp_server/server.py`
5. Open Copilot Chat → Switch to Agent Mode
6. Try: "Compare Coca-Cola and GameStop in TickerDance from 2024-01-01 to 2024-06-01"

### Tools Summary

| Tool | Description | Response Time |
|------|-------------|---------------|
| analyze_stock_data | Fetch dance parameters from real stock data | ~2s |
| get_market_mood | Get personality label for a stock | ~2s |
| recommend_date_range | Find most volatile 30-day period | ~3s |
| get_company_profile | Get company info and dance traits | Instant |
| compare_stocks | Compare two stocks dance intensity | ~4s |

### Example Copilot Queries

- "Analyze Tesla stock for Q1 2024 in TickerDance"
- "What is GameStop's market personality?"
- "Which stock dances more intensely — Coca-Cola or GameStop in 2024?"
- "Tell me about Nvidia's dance profile in TickerDance"
- "Find the best dates for the most dramatic Tesla dance performance"

### Architecture

The MCP server sits as a parallel layer alongside the frontend:

```
Frontend (React)
  └── calls backend directly via axios

GitHub Copilot Agent Mode
  └── calls MCP tools
        └── MCP Server calls FastAPI backend
              └── FastAPI calls yfinance
                    └── Returns formatted response to Copilot
```

MCP is not involved when user clicks **Generate Dance** in the browser. MCP is only used when an AI agent queries the tools directly.

### Tool Details

#### analyze_stock_data

Fetches real stock market data for a company and returns dance parameters that control the 3D dance animation in TickerDance.

**Input Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| company_name | string | Yes | Name of the company (e.g. "Tesla", "Infosys") |
| start_date | string | Yes | Start date in YYYY-MM-DD format |
| end_date | string | Yes | End date in YYYY-MM-DD format |
| dance_style | string | No | One of hip-hop, ballet, classical, robot, breakdance (default: hip-hop) |

**Example Copilot Query**

> "Use TickerDance to analyze Tesla stock from 2024-01-01 to 2024-06-01 with hip-hop style"

**Example Output**

```json
{
  "company": "Tesla",
  "ticker": "TSLA",
  "period": "2024-01-01 to 2024-06-01",
  "dance_style": "hip-hop",
  "dance_parameters": {
    "volatility": 0.35,
    "momentum": 0.22,
    "volume_intensity": 0.68,
    "trend_direction": 1.0,
    "price_range_normalized": 0.31
  },
  "bpm": 89,
  "market_mood": "ENERGETIC",
  "dancer_color": "GREEN (BULLISH)",
  "interpretation": "Tesla has ENERGETIC market behavior with BPM of 89. Dancer will appear GREEN (BULLISH)."
}
```

**What makes this tool unique:** It translates abstract financial metrics into tangible animation parameters — volatility controls BPM, momentum controls dancer color, and volume controls particle intensity. Same inputs always produce identical outputs, making results reproducible and deterministic.

---

#### get_market_mood

Analyzes stock data and returns a unique market personality label that explains WHY the dancer moves the way it does in TickerDance.

**Input Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| company_name | string | Yes | Name of the company |
| start_date | string | Yes | Start date in YYYY-MM-DD format |
| end_date | string | Yes | End date in YYYY-MM-DD format |

**Personality Labels**

| Label | Condition |
|-------|-----------|
| THE WILDCARD | High volatility, bullish |
| THE REBEL | High volatility, bearish |
| THE STEADY CLIMBER | Low volatility, bullish |
| THE INTROVERT | Low volatility, bearish |
| THE CROWD PLEASER | High volume, bullish |
| THE FALLEN STAR | High volume, bearish |
| THE CHAMPION | Strong momentum, moderate volatility |
| THE PHILOSOPHER | Neutral, sideways movement |

**Example Copilot Query**

> "Use get_market_mood tool to find the personality of GameStop from 2024-01-01 to 2024-06-01"

**Example Output**

```json
{
  "company": "GameStop",
  "period": "2024-01-01 to 2024-06-01",
  "personality": "THE WILDCARD",
  "description": "GameStop is extremely volatile with strong upward momentum. High risk, high reward energy.",
  "dance_vibe": "Explosive hip-hop with green particles everywhere and very fast BPM.",
  "bpm": 170,
  "metrics": {
    "volatility_pct": 82,
    "momentum_pct": 28,
    "volume_pct": 74,
    "trend": "BULLISH"
  },
  "tickerdance_tip": "Open TickerDance, select GameStop from 2024-01-01 to 2024-06-01 to see THE WILDCARD dance live."
}
```

**What makes this tool unique:** Unlike raw data tools, this interprets market behavior into a memorable personality archetype — transforming numbers like "volatility 82%, momentum +28%" into the narrative "THE WILDCARD — explosive hip-hop with green particles everywhere." It makes stock analysis accessible and entertaining.

---

#### recommend_date_range

Scans the last 60 days of stock data and finds the most volatile and interesting 30-day period for a company — helping users find the best dates for the most dramatic dance performance.

**Input Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| company_name | string | Yes | Name of the company |

**Example Copilot Query**

> "What is the best date range to generate the most dramatic dance for Tesla in TickerDance?"

**Example Output**

```json
{
  "company": "Tesla",
  "recommended_start_date": "2024-03-15",
  "recommended_end_date": "2024-04-14",
  "volatility_score": 92,
  "explanation": "This 30-day window had the highest market turbulence for Tesla in the last 2 years with a volatility score of 92%.",
  "expected_bpm": 169,
  "tickerdance_tip": "Open TickerDance, select Tesla, set dates from 2024-03-15 to 2024-04-14 for the most dramatic dance performance."
}
```

**What makes this tool unique:** It does the research for users by scanning historical data automatically. Users don't need to guess which date range produces the best animation — the tool finds the window of maximum market drama and delivers exact dates with a predicted BPM.

---

#### get_company_profile

Returns detailed profile for any supported company including sector, country, market category, expected BPM range, dance personality trait and a fun market fact.

**Input Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| company_name | string | Yes | Name of the company |

**Example Copilot Query**

> "Tell me about GameStop's profile and what kind of dancer it is in TickerDance"

**Example Output**

```json
{
  "company": "GameStop",
  "ticker": "GME",
  "sector": "Retail",
  "country": "USA",
  "market_category": "Extreme Volatility",
  "expected_bpm_range": "150-180",
  "dance_trait": "Meme stock madness — Reddit-driven chaos creates the most frantic dance possible",
  "fun_fact": "Rose 1700% in January 2021 driven by Reddit's WallStreetBets",
  "tickerdance_tip": "Select GameStop in TickerDance to see a Extreme Volatility dancer perform at 150-180 BPM."
}
```

**What makes this tool unique:** It's the only tool that requires no backend API call — all profiles are stored locally for instant responses. It provides the narrative context for any stock before users generate a dance, with curated fun facts that make financial data memorable.

---

#### compare_stocks

Compares two companies side by side and determines which one has a more energetic and dramatic dance performance in TickerDance. Perfect for live demos and friendly rivalries.

**Input Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| company_a | string | Yes | First company name |
| company_b | string | Yes | Second company name |
| start_date | string | Yes | Start date in YYYY-MM-DD format |
| end_date | string | Yes | End date in YYYY-MM-DD format |

**Example Copilot Query**

> "Compare Coca-Cola and GameStop in TickerDance from 2024-01-01 to 2024-06-01. Which one dances more intensely?"

**Example Output**

```json
{
  "period": "2024-01-01 to 2024-06-01",
  "comparison": {
    "Coca-Cola": {
      "bpm": 48,
      "volatility_pct": 5,
      "momentum_pct": 3,
      "dancer_color": "GREEN (BULLISH)",
      "trend": "BULLISH",
      "energy_score": 5
    },
    "GameStop": {
      "bpm": 170,
      "volatility_pct": 93,
      "momentum_pct": 18,
      "dancer_color": "ORANGE (BEARISH)",
      "trend": "BEARISH",
      "energy_score": 72
    }
  },
  "winner": "GameStop",
  "bpm_difference": 122,
  "verdict": "GameStop wins with 122 more BPM. It dances significantly more intensely than Coca-Cola.",
  "tickerdance_tip": "Open TickerDance and compare Coca-Cola vs GameStop from 2024-01-01 to 2024-06-01 to see the difference visually."
}
```

**What makes this tool unique:** It's the only tool that makes two backend calls simultaneously and computes a relative energy score (70% volatility + 30% volume) to declare a winner. It produces dramatic contrasts — like Coca-Cola's 48 BPM "sleepy ballet" against GameStop's 170 BPM "frantic breakdance" — making it ideal for presentations and demos.

### Setup

1. Create a virtual environment and install dependencies:
    ```bash
    cd mcp_server
    python -m venv venv
    .\venv\Scripts\activate    # Windows
    # or: source venv/bin/activate  # macOS/Linux
    pip install -r requirements.txt
    ```

2. Start the MCP server:
    ```bash
    python mcp_server/server.py
    ```

3. Make sure the FastAPI backend is running before using MCP tools:
    ```bash
    cd backend
    uvicorn app.main:app --reload
    ```

### Note

MCP tools operate independently from the browser frontend. When you click **Generate Dance** in the browser, the frontend calls the backend directly. MCP tools are exclusively for AI agent integration — enabling GitHub Copilot to query and interpret TickerDance data through natural language.

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