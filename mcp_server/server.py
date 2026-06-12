import json
import urllib.request
import urllib.error

from mcp import create_server, tool

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
DEFAULT_DANCE_STYLE = "classical"


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


server = create_server(transport="stdio")


@tool(name="analyze_stock_data")
def analyze_stock_data(company_name: str, start_date: str, end_date: str) -> dict:
    """Fetch dance parameters from the FastAPI backend for a company and date range."""
    if company_name not in COMPANY_TICKER_MAP:
        raise ValueError(f"Unknown company: {company_name}")

    body = {
        "company_name": company_name,
        "start_date": start_date,
        "end_date": end_date,
        "dance_style": DEFAULT_DANCE_STYLE,
    }
    result = _post_json(BACKEND_URL, body)
    return result.get("dance_parameters", {})


@tool(name="get_dance_style")
def get_dance_style(style_name: str) -> dict:
    """Return movement rules for the requested dance style."""
    style_name = style_name.strip().lower()
    styles = {
        "hip-hop": {
            "speed": "fast",
            "angles": "sharp",
            "bounce": "high",
            "energy": "street",
        },
        "ballet": {
            "speed": "slow",
            "style": "graceful",
            "spread": "wide",
            "bounce": "low",
            "flow": "elegant",
        },
        "classical": {
            "speed": "medium",
            "curves": "smooth",
            "bounce": "medium",
            "tone": "formal",
        },
    }

    if style_name not in styles:
        raise ValueError("Style must be one of: hip-hop, ballet, classical")

    return styles[style_name]


@tool(name="get_company_profile")
def get_company_profile(company_name: str) -> dict:
    """Return ticker, sector, and country for a company."""
    profile = COMPANY_PROFILES.get(company_name)
    if profile is None:
        raise ValueError(f"Unknown company: {company_name}")
    return profile


if __name__ == "__main__":
    server.serve()
