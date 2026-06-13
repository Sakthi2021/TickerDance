# TickerDance

## Project Overview

TickerDance is a creative web app that turns real stock market data into a dynamic dancing animation. Each company's stock movement generates a unique dance pattern, and users can choose dance styles like hip-hop, ballet, or classical to customize the visual presentation.

## Tech Stack

- **Frontend:** React + Vite, Anime.js, Tailwind CSS, Axios
- **Backend:** Python FastAPI, yfinance, pandas, numpy, uvicorn

## Folder Structure

A recommended project structure for TickerDance is:

- `frontend/`
  - `src/`
    - `components/`
    - `styles/`
    - `App.jsx`
    - `main.jsx`
  - `public/`
  - `package.json`
  - `vite.config.js`

- `backend/`
  - `app/`
    - `main.py`
    - `stock_data.py`
    - `models.py`
  - `requirements.txt`

- `README.md`

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

## Notes

- Make sure the backend is running before loading stock data in the frontend.
- The frontend should use Axios to request stock and animation data from the FastAPI backend.