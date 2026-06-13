import hashlib

import numpy as np
import pandas as pd
import yfinance as yf

from typing import Dict, Tuple

COMPANY_TICKER_MAP = {
    # Ultra Stable (Very Low BPM)
    "Coca-Cola": "KO",
    "Johnson & Johnson": "JNJ",
    "Procter & Gamble": "PG",
    "Walmart": "WMT",
    "Berkshire Hathaway": "BRK-B",
    
    # Indian Stable
    "Asian Paints": "ASIANPAINT.NS",
    "Nestle India": "NESTLEIND.NS",
    "Hindustan Unilever": "HINDUNILVR.NS",
    
    # Indian Markets
    "Infosys": "INFY",
    "TCS": "TCS.NS",
    "Wipro": "WIPRO.NS",
    "HCL Tech": "HCLTECH.NS",
    "Reliance": "RELIANCE.NS",
    "HDFC Bank": "HDFCBANK.NS",
    "Zomato": "ZOMATO.NS",
    "Paytm": "PAYTM.NS",
    "Adani Enterprises": "ADANIENT.NS",
    "Yes Bank": "YESBANK.NS",
    
    # US Stable
    "Apple": "AAPL",
    "Microsoft": "MSFT",
    "Google": "GOOGL",
    "Amazon": "AMZN",
    "Netflix": "NFLX",
    
    # High Volatility (Very High BPM)
    "Tesla": "TSLA",
    "Nvidia": "NVDA",
    "GameStop": "GME",
    "AMC": "AMC",
    "Coinbase": "COIN",
    "Rivian": "RIVN",
    "Palantir": "PLTR",
}


def _seed_from_dates(start_date: str, end_date: str) -> int:
    date_key = f"{start_date}:{end_date}"
    digest = hashlib.sha256(date_key.encode("utf-8")).hexdigest()
    return int(digest[:16], 16)


def _normalize(value: float, min_value: float, max_value: float) -> float:
    if max_value == min_value:
        return 0.0
    return float(np.clip((value - min_value) / (max_value - min_value), 0.0, 1.0))


def analyze_stock_data(
    company_name: str,
    start_date: str,
    end_date: str,
    dance_style: str,
) -> Tuple[Dict[str, float], str]:
    if company_name not in COMPANY_TICKER_MAP:
        raise ValueError(f"Unknown company name: {company_name}")

    ticker = COMPANY_TICKER_MAP[company_name]
    data = yf.download(ticker, start=start_date, end=end_date, progress=False, auto_adjust=True)

    if data.empty:
        raise ValueError("No stock data found for the requested date range.")

    close = data["Close"].squeeze().astype(float)
    volume = data["Volume"].squeeze().astype(float)

    returns = close.pct_change().dropna()
    raw_volatility = float(returns.std())
    min_vol = 0.001
    max_vol = 0.05
    volatility = float(np.clip(
      (raw_volatility - min_vol) / (max_vol - min_vol),
      0.0, 1.0
    ))
    
    raw_momentum = float((close.iloc[-1] - close.iloc[0]) / close.iloc[0])
    momentum = float(np.clip(raw_momentum, -1.0, 1.0))
    
    volume_intensity = float(np.clip(volume.mean() / volume.max(), 0.0, 1.0))
    price_range_normalized = float((close.max() - close.min()) / max(close.mean(), 1.0))

    trend_direction = float(np.sign(momentum))
    if trend_direction == 0.0:
        trend_direction = 1.0 if float(returns.mean()) >= 0 else -1.0

    rng = np.random.default_rng(_seed_from_dates(start_date, end_date))
    noise = rng.normal(0, 0.05, size=4)

    dance_parameters = {
        "volatility": float(np.clip(volatility + noise[0], 0.0, 1.0)),
        "momentum": float(np.clip(momentum + noise[1], -1.0, 1.0)),
        "volume_intensity": float(np.clip(volume_intensity + noise[2], 0.0, 1.0)),
        "trend_direction": float(np.clip(trend_direction + noise[3], -1.0, 1.0)),
        "price_range_normalized": float(np.clip(price_range_normalized, 0.0, 1.0)),
    }

    return dance_parameters, ticker
