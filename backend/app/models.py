from pydantic import BaseModel
from typing import Dict


class AnalyzeRequest(BaseModel):
    company_name: str
    start_date: str
    end_date: str
    dance_style: str


class AnalyzeResponse(BaseModel):
    company_name: str
    ticker: str
    dance_parameters: Dict[str, float]
