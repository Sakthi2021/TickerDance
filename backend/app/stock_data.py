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
    "Infosys": "INFY.NS",
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


def analyze_stock_data(
    company_name: str,
    start_date: str,
    end_date: str,
    dance_style: str,
) -> Tuple[Dict[str, float], str]:
    if company_name not in COMPANY_TICKER_MAP:
        raise ValueError(f"Unknown company name: {company_name}")

    ticker = COMPANY_TICKER_MAP[company_name]
    try:
        data = yf.download(ticker, start=start_date, end=end_date, progress=False, auto_adjust=True)
    except Exception:
        data = pd.DataFrame()

    if data.empty:
        data = _generate_synthetic_data(ticker, start_date, end_date)


    close = data["Close"].squeeze().astype(float)
    volume = data["Volume"].squeeze().astype(float)

    returns = close.pct_change().dropna()
    raw_volatility = float(returns.std())
    min_vol = 0.0005
    max_vol = 0.08
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

    dance_parameters = {
        "volatility": float(np.clip(volatility, 0.0, 1.0)),
        "momentum": float(np.clip(momentum, -1.0, 1.0)),
        "volume_intensity": float(np.clip(volume_intensity, 0.0, 1.0)),
        "trend_direction": float(np.clip(trend_direction, -1.0, 1.0)),
        "price_range_normalized": float(np.clip(price_range_normalized, 0.0, 1.0)),
    }

    return dance_parameters, ticker

def _generate_synthetic_data(ticker: str, start_date: str, end_date: str) -> pd.DataFrame:
    """
    Generates deterministic synthetic OHLCV data when live data is unavailable.
    Same ticker + date range always produces the same synthetic data.
    """
    seed = abs(hash(f"{ticker}_{start_date}_{end_date}")) % (2**32)
    rng = np.random.default_rng(seed)

    date_range = pd.bdate_range(start=start_date, end=end_date)  # business days
    n = len(date_range)
    if n == 0:
        n = 1
        date_range = pd.bdate_range(start=start_date, periods=1)

    base_price = 100 + (abs(hash(ticker)) % 400)  # 100-500 range, ticker-dependent
    
    # Determine volatility scale based on ticker
    high_vol_tickers = {"TSLA", "NVDA", "GME", "AMC", "COIN", "RIVN", "PLTR"}
    high_sigma_tickers = {"ZOMATO.NS", "PAYTM.NS", "ADANIENT.NS", "YESBANK.NS"}
    
    if ticker in high_vol_tickers:
        returns = rng.normal(loc=0.0002, scale=0.04, size=n)  # High volatility
    elif ticker in high_sigma_tickers:
        returns = rng.normal(loc=0.0002, scale=0.025, size=n)  # Medium-high volatility
    else:
        returns = rng.normal(loc=0.0005, scale=0.015, size=n)  # Normal/stable
    
    prices = base_price * np.cumprod(1 + returns)

    close = prices
    open_ = close * (1 + rng.normal(0, 0.005, size=n))
    high = np.maximum(open_, close) * (1 + np.abs(rng.normal(0, 0.005, size=n)))
    low = np.minimum(open_, close) * (1 - np.abs(rng.normal(0, 0.005, size=n)))
    volume = rng.integers(1_000_000, 10_000_000, size=n).astype(float)

    df = pd.DataFrame({
        "Open": open_,
        "High": high,
        "Low": low,
        "Close": close,
        "Volume": volume,
    }, index=date_range)

    return df