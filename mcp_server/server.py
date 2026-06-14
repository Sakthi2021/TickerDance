from mcp.server.fastmcp import FastMCP
import json
import urllib.request
import urllib.error

mcp = FastMCP("TickerDance MCP Server")

COMPANY_TICKER_MAP = {
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
    "Coca-Cola": "KO",
    "Johnson & Johnson": "JNJ",
    "Procter & Gamble": "PG",
    "Walmart": "WMT",
    "Berkshire Hathaway": "BRK-B",
    "Asian Paints": "ASIANPAINT.NS",
    "Nestle India": "NESTLEIND.NS",
    "Hindustan Unilever": "HINDUNILVR.NS",
    "Apple": "AAPL",
    "Tesla": "TSLA",
    "Microsoft": "MSFT",
    "Google": "GOOGL",
    "Amazon": "AMZN",
    "Netflix": "NFLX",
    "Nvidia": "NVDA",
    "GameStop": "GME",
    "AMC": "AMC",
    "Coinbase": "COIN",
    "Rivian": "RIVN",
    "Palantir": "PLTR"
}

@mcp.tool()
def analyze_stock_data(
    company_name: str,
    start_date: str,
    end_date: str,
    dance_style: str = "hip-hop"
) -> str:
    """
    Analyzes real stock market data for a company 
    and returns dance parameters that control the 
    3D dance animation in TickerDance.
    
    Parameters:
        company_name: Name of the company 
                     (e.g. "Tesla", "Infosys")
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format
        dance_style: One of hip-hop, ballet, 
                    classical, robot, breakdance
    
    Returns:
        JSON with dance parameters:
        - volatility: How wildly the stock moves (0-1)
        - momentum: Price direction (-1 to 1)
        - volume_intensity: Trading activity (0-1)
        - trend_direction: Bullish/bearish (1 or -1)
        - price_range_normalized: Price spread (0-1)
        - bpm: Dance tempo from volatility (40-180)
        - market_mood: CALM, ENERGETIC, or INTENSE
        - dancer_color: GREEN, ORANGE, or BLUE
    """
    if company_name not in COMPANY_TICKER_MAP:
        return json.dumps({
            "error": f"Unknown company: {company_name}",
            "available": list(COMPANY_TICKER_MAP.keys())
        })
    
    payload = json.dumps({
        "company_name": company_name,
        "start_date": start_date,
        "end_date": end_date,
        "dance_style": dance_style
    }).encode("utf-8")
    
    req = urllib.request.Request(
        "http://localhost:8000/api/analyze",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode("utf-8"))
            params = data.get("dance_parameters", {})
            
            volatility = params.get("volatility", 0)
            momentum = params.get("momentum", 0)
            bpm = round(40 + volatility * 140)
            
            if volatility > 0.5:
                market_mood = "INTENSE"
            elif volatility < 0.2:
                market_mood = "CALM"
            else:
                market_mood = "ENERGETIC"
            
            if momentum > 0.1:
                dancer_color = "GREEN (BULLISH)"
            elif momentum < -0.1:
                dancer_color = "ORANGE (BEARISH)"
            else:
                dancer_color = "BLUE (SIDEWAYS)"
            
            result = {
                "company": company_name,
                "ticker": data.get("ticker"),
                "period": f"{start_date} to {end_date}",
                "dance_style": dance_style,
                "dance_parameters": params,
                "bpm": bpm,
                "market_mood": market_mood,
                "dancer_color": dancer_color,
                "interpretation": f"{company_name} has {market_mood} market behavior with BPM of {bpm}. Dancer will appear {dancer_color}."
            }
            
            return json.dumps(result, indent=2)
            
    except urllib.error.URLError as e:
        return json.dumps({
            "error": "Backend not running",
            "detail": str(e),
            "fix": "Start FastAPI with: uvicorn app.main:app --reload"
        })


@mcp.tool()
def get_market_mood(
    company_name: str,
    start_date: str,
    end_date: str
) -> str:
    """
    Analyzes stock market data and returns a 
    unique market personality label for the company.
    
    Unlike the frontend which shows raw numbers,
    this tool translates market behavior into
    a human-readable personality that explains
    WHY the dancer moves the way it does.
    
    Parameters:
        company_name: Name of the company
        start_date: Start date YYYY-MM-DD
        end_date: End date YYYY-MM-DD
    
    Returns personality labels like:
        THE WILDCARD - high volatility, bullish
        THE REBEL - high volatility, bearish
        THE STEADY CLIMBER - low volatility, bullish
        THE INTROVERT - low volatility, bearish
        THE CROWD PLEASER - high volume, bullish
        THE FALLEN STAR - high volume, bearish
        THE CHAMPION - strong momentum, moderate volatility
        THE PHILOSOPHER - neutral, sideways movement
    """
    if company_name not in COMPANY_TICKER_MAP:
        return json.dumps({
            "error": f"Unknown company: {company_name}"
        })

    payload = json.dumps({
        "company_name": company_name,
        "start_date": start_date,
        "end_date": end_date,
        "dance_style": "hip-hop"
    }).encode("utf-8")

    req = urllib.request.Request(
        "http://localhost:8000/api/analyze",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode("utf-8"))
            params = data.get("dance_parameters", {})

            volatility = params.get("volatility", 0)
            momentum = params.get("momentum", 0)
            volume = params.get("volume_intensity", 0)
            trend = params.get("trend_direction", 0)
            bpm = round(40 + volatility * 140)

            if volatility > 0.7 and momentum < -0.2:
                personality = "THE REBEL"
                description = f"{company_name} is highly volatile with negative momentum. Unpredictable and moving against the market."
                dance_vibe = "Frantic breakdance with red falling particles and high BPM."

            elif volatility > 0.7 and momentum > 0.2:
                personality = "THE WILDCARD"
                description = f"{company_name} is extremely volatile with strong upward momentum. High risk, high reward energy."
                dance_vibe = "Explosive hip-hop with green particles everywhere and very fast BPM."

            elif volatility < 0.2 and momentum > 0.1:
                personality = "THE STEADY CLIMBER"
                description = f"{company_name} moves quietly but consistently upward. Reliable, calm and disciplined."
                dance_vibe = "Graceful ballet with slow BPM and gentle floating green particles."

            elif volatility < 0.2 and momentum < -0.1:
                personality = "THE INTROVERT"
                description = f"{company_name} is quiet but declining. Low energy, minimal movement."
                dance_vibe = "Slow classical dance with few amber sideways particles."

            elif volume > 0.6 and momentum > 0.2:
                personality = "THE CROWD PLEASER"
                description = f"{company_name} has high trading volume with positive momentum. Everyone wants a piece of it."
                dance_vibe = "Energetic hip-hop with many green rising particles."

            elif volume > 0.6 and momentum < -0.2:
                personality = "THE FALLEN STAR"
                description = f"{company_name} has high volume but negative momentum. Everyone is selling."
                dance_vibe = "Intense breakdance with red falling particles."

            elif momentum > 0.3 and volatility > 0.3:
                personality = "THE CHAMPION"
                description = f"{company_name} shows strong upward momentum with healthy volatility. A confident market leader."
                dance_vibe = "Powerful hip-hop with green scattered particles and strong BPM."

            else:
                personality = "THE PHILOSOPHER"
                description = f"{company_name} moves sideways with neutral signals. Waiting for direction."
                dance_vibe = "Classical dance with amber drifting particles and medium BPM."

            return json.dumps({
                "company": company_name,
                "period": f"{start_date} to {end_date}",
                "personality": personality,
                "description": description,
                "dance_vibe": dance_vibe,
                "bpm": bpm,
                "metrics": {
                    "volatility_pct": round(volatility * 100),
                    "momentum_pct": round(momentum * 100),
                    "volume_pct": round(volume * 100),
                    "trend": "BULLISH" if trend > 0 else "BEARISH"
                },
                "tickerdance_tip": f"Open TickerDance, select {company_name} from {start_date} to {end_date} to see {personality} dance live."
            }, indent=2)

    except urllib.error.URLError as e:
        return json.dumps({
            "error": "Backend not running",
            "detail": str(e),
            "fix": "Start FastAPI: uvicorn app.main:app --reload"
        })


@mcp.tool()
def recommend_date_range(company_name: str) -> str:
    """
    Scans the last 2 years of stock data and finds
    the most volatile and interesting 30-day period
    for a company. This helps users find the best
    date range to generate the most dramatic and
    expressive dance in TickerDance.
    
    Parameters:
        company_name: Name of the company
    
    Returns:
        Best start and end date with volatility score
        and explanation of why this period is interesting
    """
    if company_name not in COMPANY_TICKER_MAP:
        return json.dumps({
            "error": f"Unknown company: {company_name}"
        })

    import yfinance as yf
    from datetime import datetime, timedelta

    ticker_symbol = COMPANY_TICKER_MAP[company_name]

    end = datetime.today()
    start = end - timedelta(days=60)

    try:
        data = yf.download(
            ticker_symbol,
            start=start.strftime('%Y-%m-%d'),
            end=end.strftime('%Y-%m-%d'),
            progress=False,
            auto_adjust=True
        )

        if data.empty:
            return json.dumps({
                "error": f"No data found for {company_name}"
            })

        close = data['Close'].squeeze().astype(float)
        returns = close.pct_change().dropna()

        best_start = None
        best_volatility = 0
        best_end = None

        for i in range(len(returns) - 30):
            window = returns.iloc[i:i+30]
            vol = float(window.std())
            if vol > best_volatility:
                best_volatility = vol
                best_start = returns.index[i]
                best_end = returns.index[i+29]

        if best_start is None:
            return json.dumps({
                "error": "Could not find date range"
            })

        min_vol = 0.001
        max_vol = 0.05
        vol_score = round(
            min(max((best_volatility - min_vol) /
            (max_vol - min_vol), 0), 1) * 100
        )

        start_str = best_start.strftime('%Y-%m-%d')
        end_str = best_end.strftime('%Y-%m-%d')

        return json.dumps({
            "company": company_name,
            "recommended_start_date": start_str,
            "recommended_end_date": end_str,
            "volatility_score": vol_score,
            "explanation": f"This 30-day window had the highest market turbulence for {company_name} in the last 2 years with a volatility score of {vol_score}%.",
            "expected_bpm": round(40 + min(best_volatility / 0.05, 1) * 140),
            "tickerdance_tip": f"Open TickerDance, select {company_name}, set dates from {start_str} to {end_str} for the most dramatic dance performance."
        }, indent=2)

    except Exception as e:
        return json.dumps({
            "error": str(e)
        })


@mcp.tool()
def get_company_profile(company_name: str) -> str:
    """
    Returns detailed profile information for a company
    supported in TickerDance including sector, country,
    market category and dance personality traits.
    
    This helps users understand what kind of dancer
    a company is likely to be before generating
    the actual dance performance.
    
    Parameters:
        company_name: Name of the company
    
    Returns:
        Company profile with sector, country,
        market category and expected dance traits
    """
    
    COMPANY_PROFILES = {
        "Coca-Cola": {
            "ticker": "KO",
            "sector": "Consumer Staples",
            "country": "USA",
            "market_category": "Ultra Stable",
            "expected_bpm_range": "40-60",
            "dance_trait": "Slow and graceful — decades of consistent performance make Coca-Cola a natural ballet dancer",
            "fun_fact": "One of Warren Buffett's favorite stocks — as stable as it gets"
        },
        "Johnson & Johnson": {
            "ticker": "JNJ",
            "sector": "Healthcare",
            "country": "USA",
            "market_category": "Ultra Stable",
            "expected_bpm_range": "40-60",
            "dance_trait": "Controlled and elegant — minimal volatility creates smooth classical movements",
            "fun_fact": "Over 130 years old — the ultimate steady climber"
        },
        "Procter & Gamble": {
            "ticker": "PG",
            "sector": "Consumer Staples",
            "country": "USA",
            "market_category": "Ultra Stable",
            "expected_bpm_range": "40-65",
            "dance_trait": "Methodical and precise — consistent dividends create a reliable rhythm",
            "fun_fact": "Makes products used by 5 billion people daily"
        },
        "Walmart": {
            "ticker": "WMT",
            "sector": "Retail",
            "country": "USA",
            "market_category": "Stable",
            "expected_bpm_range": "50-70",
            "dance_trait": "Steady and grounded — the world's largest retailer keeps a reliable beat",
            "fun_fact": "Serves over 230 million customers per week"
        },
        "Berkshire Hathaway": {
            "ticker": "BRK-B",
            "sector": "Diversified",
            "country": "USA",
            "market_category": "Ultra Stable",
            "expected_bpm_range": "40-55",
            "dance_trait": "Slow and authoritative — Warren Buffett's wisdom reflected in every measured move",
            "fun_fact": "Never paid a dividend — all returns through price appreciation"
        },
        "Asian Paints": {
            "ticker": "ASIANPAINT.NS",
            "sector": "Materials",
            "country": "India",
            "market_category": "Stable",
            "expected_bpm_range": "50-75",
            "dance_trait": "Colorful and consistent — India's paint leader moves with quiet confidence",
            "fun_fact": "Market leader in India for over 7 decades"
        },
        "Nestle India": {
            "ticker": "NESTLEIND.NS",
            "sector": "Consumer Staples",
            "country": "India",
            "market_category": "Stable",
            "expected_bpm_range": "45-65",
            "dance_trait": "Smooth and nourishing — like Maggi, always reliable",
            "fun_fact": "Maggi noodles alone contribute over 30% of revenue"
        },
        "Hindustan Unilever": {
            "ticker": "HINDUNILVR.NS",
            "sector": "Consumer Staples",
            "country": "India",
            "market_category": "Stable",
            "expected_bpm_range": "45-65",
            "dance_trait": "Elegant and widespread — touches every Indian household",
            "fun_fact": "Products reach over 700 million Indians daily"
        },
        "Infosys": {
            "ticker": "INFY",
            "sector": "Information Technology",
            "country": "India",
            "market_category": "Moderate",
            "expected_bpm_range": "60-90",
            "dance_trait": "Precise and technical — IT giant moves with digital efficiency",
            "fun_fact": "One of India's most globally recognized tech brands"
        },
        "TCS": {
            "ticker": "TCS.NS",
            "sector": "Information Technology",
            "country": "India",
            "market_category": "Moderate",
            "expected_bpm_range": "55-85",
            "dance_trait": "Consistent and global — largest IT company in India dances with corporate grace",
            "fun_fact": "Employs over 600,000 people worldwide"
        },
        "Wipro": {
            "ticker": "WIPRO.NS",
            "sector": "Information Technology",
            "country": "India",
            "market_category": "Moderate",
            "expected_bpm_range": "55-80",
            "dance_trait": "Adaptive and steady — moves with quiet IT efficiency",
            "fun_fact": "Started as a vegetable oil company in 1945"
        },
        "HCL Tech": {
            "ticker": "HCLTECH.NS",
            "sector": "Information Technology",
            "country": "India",
            "market_category": "Moderate",
            "expected_bpm_range": "60-85",
            "dance_trait": "Energetic and innovative — one of India's fastest growing IT dancers",
            "fun_fact": "Known for engineering-led services globally"
        },
        "Reliance": {
            "ticker": "RELIANCE.NS",
            "sector": "Conglomerate",
            "country": "India",
            "market_category": "Moderate",
            "expected_bpm_range": "65-95",
            "dance_trait": "Bold and dominant — India's largest company commands the stage",
            "fun_fact": "Mukesh Ambani's empire spans oil, retail, and telecom"
        },
        "HDFC Bank": {
            "ticker": "HDFCBANK.NS",
            "sector": "Financial Services",
            "country": "India",
            "market_category": "Stable",
            "expected_bpm_range": "50-75",
            "dance_trait": "Disciplined and trustworthy — India's top private bank moves with banker precision",
            "fun_fact": "Largest private sector bank in India by assets"
        },
        "Zomato": {
            "ticker": "ZOMATO.NS",
            "sector": "Consumer Services",
            "country": "India",
            "market_category": "Volatile",
            "expected_bpm_range": "90-140",
            "dance_trait": "Fast and hungry — food delivery urgency reflected in every move",
            "fun_fact": "Delivers to over 800 cities across India"
        },
        "Paytm": {
            "ticker": "PAYTM.NS",
            "sector": "Fintech",
            "country": "India",
            "market_category": "High Volatility",
            "expected_bpm_range": "100-160",
            "dance_trait": "Unpredictable and disruptive — fintech turbulence creates chaotic moves",
            "fun_fact": "India's first major digital payments platform"
        },
        "Adani Enterprises": {
            "ticker": "ADANIENT.NS",
            "sector": "Conglomerate",
            "country": "India",
            "market_category": "High Volatility",
            "expected_bpm_range": "110-170",
            "dance_trait": "Explosive and controversial — high drama stock creates intense performances",
            "fun_fact": "Lost $100B in market cap after Hindenburg report in 2023"
        },
        "Yes Bank": {
            "ticker": "YESBANK.NS",
            "sector": "Financial Services",
            "country": "India",
            "market_category": "High Volatility",
            "expected_bpm_range": "100-165",
            "dance_trait": "Erratic and recovering — banking crisis creates unpredictable rhythm",
            "fun_fact": "Nearly collapsed in 2020 before RBI rescue"
        },
        "Apple": {
            "ticker": "AAPL",
            "sector": "Technology",
            "country": "USA",
            "market_category": "Stable",
            "expected_bpm_range": "55-80",
            "dance_trait": "Elegant and premium — Apple's luxury positioning creates refined movements",
            "fun_fact": "First company to reach $3 trillion market cap"
        },
        "Microsoft": {
            "ticker": "MSFT",
            "sector": "Technology",
            "country": "USA",
            "market_category": "Stable",
            "expected_bpm_range": "55-80",
            "dance_trait": "Powerful and consistent — enterprise dominance creates steady confident moves",
            "fun_fact": "Azure cloud growing 20%+ annually"
        },
        "Google": {
            "ticker": "GOOGL",
            "sector": "Technology",
            "country": "USA",
            "market_category": "Moderate",
            "expected_bpm_range": "65-90",
            "dance_trait": "Intelligent and curious — search giant explores every movement",
            "fun_fact": "Processes over 8.5 billion searches per day"
        },
        "Amazon": {
            "ticker": "AMZN",
            "sector": "E-Commerce/Cloud",
            "country": "USA",
            "market_category": "Moderate",
            "expected_bpm_range": "70-100",
            "dance_trait": "Relentless and expansive — always moving, never stopping",
            "fun_fact": "AWS generates more profit than all of Amazon retail"
        },
        "Netflix": {
            "ticker": "NFLX",
            "sector": "Entertainment",
            "country": "USA",
            "market_category": "Moderate",
            "expected_bpm_range": "75-110",
            "dance_trait": "Dramatic and binge-worthy — streaming volatility creates compelling performances",
            "fun_fact": "Spends over $17 billion on content annually"
        },
        "Tesla": {
            "ticker": "TSLA",
            "sector": "Automotive/EV",
            "country": "USA",
            "market_category": "High Volatility",
            "expected_bpm_range": "110-170",
            "dance_trait": "Electric and unpredictable — Elon's tweets alone move the stock",
            "fun_fact": "Stock rose 700% in 2020 alone"
        },
        "Nvidia": {
            "ticker": "NVDA",
            "sector": "Semiconductors",
            "country": "USA",
            "market_category": "High Volatility",
            "expected_bpm_range": "100-165",
            "dance_trait": "Explosive and AI-powered — GPU demand creates electrifying movements",
            "fun_fact": "Stock rose 240% in 2023 driven by AI boom"
        },
        "GameStop": {
            "ticker": "GME",
            "sector": "Retail",
            "country": "USA",
            "market_category": "Extreme Volatility",
            "expected_bpm_range": "150-180",
            "dance_trait": "Meme stock madness — Reddit-driven chaos creates the most frantic dance possible",
            "fun_fact": "Rose 1700% in January 2021 driven by Reddit's WallStreetBets"
        },
        "AMC": {
            "ticker": "AMC",
            "sector": "Entertainment",
            "country": "USA",
            "market_category": "Extreme Volatility",
            "expected_bpm_range": "140-180",
            "dance_trait": "Meme stock energy — theatrical volatility creates dramatic performances",
            "fun_fact": "Another WallStreetBets favorite that rose 2800% in 2021"
        },
        "Coinbase": {
            "ticker": "COIN",
            "sector": "Crypto/Fintech",
            "country": "USA",
            "market_category": "High Volatility",
            "expected_bpm_range": "120-175",
            "dance_trait": "Crypto-linked chaos — Bitcoin price swings make Coinbase dance wildly",
            "fun_fact": "Revenue dropped 75% when crypto crashed in 2022"
        },
        "Rivian": {
            "ticker": "RIVN",
            "sector": "Automotive/EV",
            "country": "USA",
            "market_category": "High Volatility",
            "expected_bpm_range": "115-170",
            "dance_trait": "Ambitious and turbulent — EV startup uncertainty creates dramatic movements",
            "fun_fact": "Lost over 80% of its value from IPO peak"
        },
        "Palantir": {
            "ticker": "PLTR",
            "sector": "Data Analytics/AI",
            "country": "USA",
            "market_category": "High Volatility",
            "expected_bpm_range": "100-160",
            "dance_trait": "Mysterious and data-driven — AI analytics company moves with calculated intensity",
            "fun_fact": "Originally built to track terrorists for the CIA"
        }
    }

    if company_name not in COMPANY_PROFILES:
        return json.dumps({
            "error": f"No profile found for {company_name}",
            "available": list(COMPANY_PROFILES.keys())
        })

    profile = COMPANY_PROFILES[company_name]

    return json.dumps({
        "company": company_name,
        "ticker": profile["ticker"],
        "sector": profile["sector"],
        "country": profile["country"],
        "market_category": profile["market_category"],
        "expected_bpm_range": profile["expected_bpm_range"],
        "dance_trait": profile["dance_trait"],
        "fun_fact": profile["fun_fact"],
        "tickerdance_tip": f"Select {company_name} in TickerDance to see a {profile['market_category']} dancer perform at {profile['expected_bpm_range']} BPM."
    }, indent=2)

@mcp.tool()
def compare_stocks(
    company_a: str,
    company_b: str,
    start_date: str,
    end_date: str
) -> str:
    """
    Compares two companies side by side and determines
    which one would have a more energetic and dramatic
    dance performance in TickerDance.
    
    Perfect for finding the most contrasting pair
    to demonstrate TickerDance's data-driven choreography.
    
    Parameters:
        company_a: First company name
        company_b: Second company name
        start_date: Start date YYYY-MM-DD
        end_date: End date YYYY-MM-DD
    
    Returns:
        Side by side comparison with winner,
        BPM difference, and dance recommendation
    """
    
    def fetch_params(company):
        if company not in COMPANY_TICKER_MAP:
            return None
        
        payload = json.dumps({
            "company_name": company,
            "start_date": start_date,
            "end_date": end_date,
            "dance_style": "hip-hop"
        }).encode("utf-8")
        
        req = urllib.request.Request(
            "http://localhost:8000/api/analyze",
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                data = json.loads(response.read().decode("utf-8"))
                return data.get("dance_parameters", {})
        except Exception:
            return None

    params_a = fetch_params(company_a)
    params_b = fetch_params(company_b)

    if not params_a:
        return json.dumps({"error": f"Could not fetch data for {company_a}"})
    if not params_b:
        return json.dumps({"error": f"Could not fetch data for {company_b}"})

    vol_a = params_a.get("volatility", 0)
    vol_b = params_b.get("volatility", 0)
    mom_a = params_a.get("momentum", 0)
    mom_b = params_b.get("momentum", 0)
    volume_a = params_a.get("volume_intensity", 0)
    volume_b = params_b.get("volume_intensity", 0)
    trend_a = params_a.get("trend_direction", 0)
    trend_b = params_b.get("trend_direction", 0)

    bpm_a = round(40 + vol_a * 140)
    bpm_b = round(40 + vol_b * 140)

    energy_a = vol_a * 0.7 + volume_a * 0.3
    energy_b = vol_b * 0.7 + volume_b * 0.3

    color_a = "GREEN (BULLISH)" if mom_a > 0.1 else "ORANGE (BEARISH)" if mom_a < -0.1 else "BLUE (SIDEWAYS)"
    color_b = "GREEN (BULLISH)" if mom_b > 0.1 else "ORANGE (BEARISH)" if mom_b < -0.1 else "BLUE (SIDEWAYS)"

    if energy_a > energy_b:
        winner = company_a
        loser = company_b
        bpm_diff = bpm_a - bpm_b
        verdict = f"{company_a} wins with {bpm_diff} more BPM. It dances significantly more intensely than {company_b}."
    elif energy_b > energy_a:
        winner = company_b
        loser = company_a
        bpm_diff = bpm_b - bpm_a
        verdict = f"{company_b} wins with {bpm_diff} more BPM. It dances significantly more intensely than {company_a}."
    else:
        winner = "DRAW"
        bpm_diff = 0
        verdict = f"Both companies have equal dance energy in this period."

    return json.dumps({
        "period": f"{start_date} to {end_date}",
        "comparison": {
            company_a: {
                "bpm": bpm_a,
                "volatility_pct": round(vol_a * 100),
                "momentum_pct": round(mom_a * 100),
                "dancer_color": color_a,
                "trend": "BULLISH" if trend_a > 0 else "BEARISH",
                "energy_score": round(energy_a * 100)
            },
            company_b: {
                "bpm": bpm_b,
                "volatility_pct": round(vol_b * 100),
                "momentum_pct": round(mom_b * 100),
                "dancer_color": color_b,
                "trend": "BULLISH" if trend_b > 0 else "BEARISH",
                "energy_score": round(energy_b * 100)
            }
        },
        "winner": winner,
        "bpm_difference": bpm_diff,
        "verdict": verdict,
        "tickerdance_tip": f"Open TickerDance and compare {company_a} vs {company_b} from {start_date} to {end_date} to see the difference visually."
    }, indent=2)


if __name__ == "__main__":
    mcp.run()
