import json
import urllib.error
import urllib.request

from mcp.server.fastmcp import FastMCP

COMPANY_TICKER_MAP = {
    "Infosys": "INFY",
    "TCS": "TCS.NS",
    "Wipro": "WIPRO.NS",
    "HCL Tech": "HCLTECH.NS",
    "Reliance": "RELIANCE.NS",
    "HDFC Bank": "HDFCBANK.NS",
    "Zomato": "ZOMATO.NS",
    "Apple": "AAPL",
    "Tesla": "TSLA",
    "Microsoft": "MSFT",
    "Google": "GOOGL",
    "Amazon": "AMZN",
    "Netflix": "NFLX",
}

COMPANY_PROFILES = {
    "Infosys": {"ticker": "INFY", "sector": "Information Technology", "country": "India"},
    "TCS": {"ticker": "TCS.NS", "sector": "Information Technology", "country": "India"},
    "Wipro": {"ticker": "WIPRO.NS", "sector": "Information Technology", "country": "India"},
    "HCL Tech": {"ticker": "HCLTECH.NS", "sector": "Information Technology", "country": "India"},
    "Reliance": {"ticker": "RELIANCE.NS", "sector": "Energy / Conglomerate", "country": "India"},
    "HDFC Bank": {"ticker": "HDFCBANK.NS", "sector": "Financial Services", "country": "India"},
    "Zomato": {"ticker": "ZOMATO.NS", "sector": "Consumer Services", "country": "India"},
    "Apple": {"ticker": "AAPL", "sector": "Technology Hardware", "country": "USA"},
    "Tesla": {"ticker": "TSLA", "sector": "Automotive", "country": "USA"},
    "Microsoft": {"ticker": "MSFT", "sector": "Software", "country": "USA"},
    "Google": {"ticker": "GOOGL", "sector": "Internet Services", "country": "USA"},
    "Amazon": {"ticker": "AMZN", "sector": "E-commerce", "country": "USA"},
    "Netflix": {"ticker": "NFLX", "sector": "Entertainment", "country": "USA"},
}

BACKEND_URL = "http://localhost:8000/api/analyze"

mcp = FastMCP("TickerDance MCP Server")


def _post_json(url: str, body: dict) -> dict:
    payload = json.dumps(body).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            response_data = response.read().decode("utf-8")
            return json.loads(response_data)
    except urllib.error.HTTPError as error:
        message = error.read().decode("utf-8")
        raise RuntimeError(f"Backend request failed: {error.code} {message}")
    except urllib.error.URLError as error:
        raise RuntimeError(f"Backend request failed: {error.reason}")


@mcp.tool()
def analyze_stock_data(company_name: str, start_date: str, end_date: str, dance_style: str) -> str:
    """Fetch dance parameters from the FastAPI backend for a company and date range."""
    if company_name not in COMPANY_TICKER_MAP:
        raise ValueError(f"Unknown company: {company_name}")
    body = {
        "company_name": company_name,
        "start_date": start_date,
        "end_date": end_date,
        "dance_style": dance_style,
    }
    result = _post_json(BACKEND_URL, body)
    return json.dumps(result.get("dance_parameters", {}))


@mcp.tool()
def get_dance_style(style_name: str) -> str:
    """Return movement rules for the requested dance style."""
    style_key = style_name.strip().lower()
    styles = {
        "hip-hop": {
            "style": "hip-hop",
            "speed": "fast",
            "angles": "sharp",
            "bounce": "high",
            "smoothness": 0.2,
            "speed_multiplier": 1.8,
        },
        "ballet": {
            "style": "ballet",
            "speed": "slow",
            "movement": "graceful",
            "bounce": "low",
            "smoothness": 0.9,
            "speed_multiplier": 0.6,
        },
        "classical": {
            "style": "classical",
            "speed": "medium",
            "curves": "smooth",
            "bounce": "medium",
            "smoothness": 0.6,
            "speed_multiplier": 1.0,
        },
    }
    if style_key not in styles:
        raise ValueError("Style must be one of: hip-hop, ballet, classical")
    return json.dumps(styles[style_key])


@mcp.tool()
def get_company_profile(company_name: str) -> str:
    """Return ticker, sector, and country for a company."""
    if company_name not in COMPANY_PROFILES:
        raise ValueError(f"Unknown company: {company_name}")
    return json.dumps(COMPANY_PROFILES[company_name])


if __name__ == "__main__":
    mcp.run()