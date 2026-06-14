from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.iq_service import get_market_story

from app.models import AnalyzeRequest, AnalyzeResponse
from app.stock_data import analyze_stock_data

app = FastAPI(title="TickerDance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze_stock(request: AnalyzeRequest):
    try:
        dance_parameters, ticker = analyze_stock_data(
            request.company_name,
            request.start_date,
            request.end_date,
            request.dance_style,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    return AnalyzeResponse(
        company_name=request.company_name,
        ticker=ticker,
        dance_parameters=dance_parameters,
    )

@app.get("/api/market-story")
def market_story(company: str, start_date: str, end_date: str, dance_style: str = "hip-hop"):
    try:
        dance_parameters, ticker = analyze_stock_data(
            company, start_date, end_date, dance_style
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    story = get_market_story(company, start_date, end_date, dance_parameters)
    return {"story": story}
