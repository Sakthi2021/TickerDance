from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

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
