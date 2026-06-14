import os
from openai import OpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from dotenv import load_dotenv

load_dotenv()

FOUNDRY_ENDPOINT = os.getenv("FOUNDRY_ENDPOINT")
FOUNDRY_MODEL = os.getenv("FOUNDRY_MODEL_DEPLOYMENT", "gpt-oss-120b")

token_provider = get_bearer_token_provider(
    DefaultAzureCredential(), "https://ai.azure.com/.default"
)

client = OpenAI(
    base_url=FOUNDRY_ENDPOINT,
    api_key=token_provider,
)


def get_market_story(company_name: str, start_date: str, end_date: str, dna_stats: dict) -> str:
    """
    Uses the gpt-oss-120b deployment on Microsoft Foundry to generate
    a short, grounded "market story" based on the computed Dance DNA stats.
    """
    prompt = (
        f"You are a market commentator for a creative app called TickerDance, "
        f"which turns stock data into dance animations.\n\n"
        f"Company: {company_name}\n"
        f"Period: {start_date} to {end_date}\n"
        f"Stats: {dna_stats}\n\n"
        f"Write a short, punchy 2-3 sentence summary explaining what this data "
        f"suggests about the company's market behavior, in a fun tone connecting "
        f"to the idea of 'dancing' (e.g., energetic, calm, chaotic)."
    )

    completion = client.chat.completions.create(
        model=FOUNDRY_MODEL,
        messages=[{"role": "user", "content": prompt}],
    )

    return completion.choices[0].message.content